import { BufferedFile } from '../minio-client/file.model';
import { MinioClientService } from '../minio-client/minio-client.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ImageUploadService {
    constructor(private minioClientService: MinioClientService) {}

    async uploadImage(file: BufferedFile) {
        const uploaded_image = await this.minioClientService.upload(file);

        return {
            image_url: uploaded_image.url,
            message: 'Image uploaded successfully'
        };
    }
}
