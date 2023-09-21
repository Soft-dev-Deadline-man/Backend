import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
import { BufferedFile } from './file.model';
import * as crypto from 'crypto';

@Injectable()
export class MinioClientService {
    constructor(private readonly minio: MinioService) {
        this.logger = new Logger(MinioClientService.name);

        const policy = {
            Version: '2012-10-17',
            Statement: [
              {
                Effect: 'Allow',
                Principal: {
                  AWS: ['*'],
                },
                Action: [
                  's3:ListBucketMultipartUploads',
                  's3:GetBucketLocation',
                  's3:ListBucket',
                ],
                Resource: ['arn:aws:s3:::test-bucket'], // Change this according to your bucket name
              },
              {
                Effect: 'Allow',
                Principal: {
                  AWS: ['*'],
                },
                Action: [
                  's3:PutObject',
                  's3:AbortMultipartUpload',
                  's3:DeleteObject',
                  's3:GetObject',
                  's3:ListMultipartUploadParts',
                ],
                Resource: ['arn:aws:s3:::test-bucket/*'], // Change this according to your bucket name
              },
            ],
          };
          this.client.setBucketPolicy(
            process.env.MINIO_BUCKET_NAME,
            JSON.stringify(policy),
            function (err) {
              if (err) throw err;
      
              console.log('Bucket policy set');
            },
          );
    }

    private readonly logger: Logger;
    private readonly bucketName = process.env.MINIO_BUCKET_NAME;

    public get client() {
        return this.minio.client;
    }

    public async upload(file: BufferedFile, bucketName: string = this.bucketName){
        // Only allow jpeg and png
        if(!(file.mimetype.includes('jpeg') || file.mimetype.includes('png'))) {
            throw new HttpException('File type not supported', HttpStatus.BAD_REQUEST);
        }
        
        // Limited to 5MB
        if(file.size > 5000000) {
            throw new HttpException('File size too large', HttpStatus.BAD_REQUEST);
        }

        // Image Width and Height must be more than 400px
        const dimensions = sizeOf(file.buffer);
        if(dimensions.width < 400 || dimensions.height < 400) {
            throw new HttpException('Image dimensions too small', HttpStatus.BAD_REQUEST);
        }

        const timestamp = Date.now().toString();
        const hashedFileName = crypto.createHash('md5').update(timestamp + file.originalname).digest('hex');
        const extension = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
        const metadata = { 'Content-type': file.mimetype };
        const fileName = hashedFileName + extension;

        this.client.putObject(bucketName, fileName, file.buffer, metadata, (err, etag) => {
            if(err) {
                this.logger.error(err);
                throw new HttpException('Error uploading file', HttpStatus.BAD_REQUEST);
            }
        });

        return { url: `${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${process.env.MINIO_BUCKET_NAME}/${fileName}` }
    }

    async delete(fileName: string, bucketName: string = this.bucketName) {
        this.client.removeObject(bucketName, fileName, (err) => {
            if(err) {
                throw new HttpException('Error deleting file', HttpStatus.BAD_REQUEST);
            }
        });
    }
}

function sizeOf(buffer: string | Buffer) {
  // git image size without using any npm package
  const head = buffer.toString('hex', 0, 4);
  const type = head.substring(0, 2);
  const width = head.substring(2, 4);
  const height = head.substring(4, 6);
  
  return {
    type: type,
    width: parseInt(width, 16),
    height: parseInt(height, 16),
  };
}