import { BufferedFile } from 'src/minio-client/file.model';
import { MinioClientService } from './../minio-client/minio-client.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FileUploadService {
    constructor(
        private minioClientService: MinioClientService
    ) {}

    async uploadSingleImage(image: BufferedFile){
        let uploadImage = await this.minioClientService.upload(image);

        return {
            image_url: uploadImage.url,
            message: "Image uploaded successfully"
        }
    }

    async uploadMultipleImages(images: BufferedFile[]){
        let uploadImages = await this.minioClientService.uploadMultiple(images);

        return {
            images_url: uploadImages,
            message: "Images uploaded successfully"
        }
    }
}
