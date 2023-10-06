import { BufferedFile } from '../minio-client/file.model';
import { MinioClientService } from '../minio-client/minio-client.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ImageUploadService {
  constructor(private minioClientService: MinioClientService) {}

  async uploadImage(image: BufferedFile) {
    try {
      const uploaded_image = await this.minioClientService.upload(image);

      return {
        image_url: uploaded_image.url,
        message: 'Image uploaded successfully',
      };
    } catch (err) {
      return {
        message: 'Image uploaded failed',
      };
    }
  }

  async uploadMultipleImages(images: BufferedFile[]) {
    try {
      const uploadImages = await this.minioClientService.uploadMultiple(images);

      return {
        images_url: uploadImages,
        message: 'Images uploaded successfully',
      };
    } catch (err) {
      return {
        message: 'Images uploaded failed',
      };
    }
  }
}
