import { Module } from '@nestjs/common';
import { Review } from '../review/review';
import { ReviewSchema } from '../review/schemas/review.schema';
import { ImageUploadService } from './image-upload.service';
import { ImageUploadController } from './image-upload.controller';
import { MinioClientModule } from '../minio-client/minio-client.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ReviewModule } from 'src/review/review.module';

@Module({
  imports: [
    MinioClientModule,
    MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }]),
    ReviewModule,
  ],
  controllers: [ImageUploadController],
  providers: [ImageUploadService],
})
export class ImageUploadModule {}
