import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  Get,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { Review } from './schemas/review.schema';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReturnReviewDto } from './dto/return-review.dto';
import { UserService } from 'src/User/user.service';

@Controller('review')
export class ReviewController {
  constructor(
    private readonly reviewService: ReviewService,
    private readonly userService: UserService,
  ) {}

  @Get()
  async getAllReviews(): Promise<Promise<ReturnReviewDto>[]> {
    const reviews = await this.reviewService.findAll();

    return reviews.map(async (review) => {
      const returnReviewDto = new ReturnReviewDto();
      const user = await this.userService.findById(review.authorId);

      returnReviewDto.blogId = review.blogId;
      returnReviewDto.title = review.title;
      returnReviewDto.description = review.description;
      returnReviewDto.recommendActivity = review.recommendActivity;
      returnReviewDto.spendTime = review.spendTime;
      returnReviewDto.rating = review.rating;
      returnReviewDto.score = review.score;
      returnReviewDto.images = review.images;
      returnReviewDto.author = {
        name: user.name,
        profile: user.profile,
      };

      return returnReviewDto;
    });
  }

  @Post()
  async createReview(@Body() review: CreateReviewDto): Promise<Review> {
    return await this.reviewService.create(review);
  }

  @Patch(':id')
  async updateReview(
    @Param('id') id: string,
    @Body() review: UpdateReviewDto,
  ): Promise<Review> {
    return await this.reviewService.updateById(id, review);
  }

  @Delete(':id')
  async deleteReview(@Param('id') id: string): Promise<Review> {
    return await this.reviewService.deleteById(id);
  }
}
