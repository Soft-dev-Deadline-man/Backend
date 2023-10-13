import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Review } from "./review";
import { ReviewSchema } from "./schemas/review.schema";
import { ReviewController } from "./review.controller";
import { ReviewService } from "./review.service";
import { UserModule } from "src/User/user.module";
import { BlogModule } from "src/Blog/blog.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }]),
    UserModule,
    BlogModule,
  ],
  controllers: [ReviewController],
  providers: [ReviewService],
  exports: [ReviewService],
})
export class ReviewModule {}
