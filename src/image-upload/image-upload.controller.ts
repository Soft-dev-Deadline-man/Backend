import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ImageUploadService } from './image-upload.service';
import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { BufferedFile } from '../minio-client/file.model';

@Controller('image-upload')
export class ImageUploadController {
  constructor(private imageUploadService: ImageUploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(@UploadedFile() image: BufferedFile) {
    return await this.imageUploadService.uploadImage(image);
  }

  @Post('multiple-upload')
  @UseInterceptors(FilesInterceptor('images', 10))
  async uploadMultipleImages(
    @UploadedFiles() images: BufferedFile[],
    @Body() reviewId: { reviewId: string },
  ) {
    return await this.imageUploadService.uploadMultipleImages(images, reviewId);
  }
}
