import { BufferedFile } from '../minio-client/file.model';
import { MinioClientService } from '../minio-client/minio-client.service';
import { HttpException, Injectable } from '@nestjs/common';
import { Review } from 'src/review/schemas/review.schema';
import { ReviewService } from 'src/review/review.service';

@Injectable()
export class ImageUploadService {
  constructor(
    private reviewService: ReviewService,
    private minioClientService: MinioClientService,
  ) {}

  async uploadImage(image: BufferedFile) {
    try {
      const uploaded_image = await this.minioClientService.upload(image);

      return {
        image_url: uploaded_image.url,
        message: 'Image uploaded successfully',
      };
    } catch (err) {
      return {
        status:
          err instanceof HttpException
            ? err.message
            : 'Unknown error encountered',
        message: 'Image uploaded failed',
      };
    }
  }

  async uploadMultipleImages(
    image: BufferedFile[],
    reviewId: { reviewId: string },
  ) {
    try {
      const uploadImages = await this.minioClientService.uploadMultiple(image);
      const imageUrls = uploadImages.map((obj) => obj.url);
      await this.reviewService.updateById(reviewId.reviewId, {
        images: imageUrls,
      } as Review);
      return {
        message: 'Images uploaded successfully',
      };
    } catch (err) {
      return {
        err:
          err instanceof HttpException
            ? err.message
            : 'Unknown error encountered',
        message: 'Images uploaded failed',
      };
    }
  }
}
