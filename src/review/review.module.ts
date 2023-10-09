import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Review } from './review';
import { ReviewSchema } from './schemas/review.schema';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { UserModule } from 'src/User/user.module';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }]),
  ],
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewModule {}
