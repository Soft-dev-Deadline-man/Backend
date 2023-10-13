import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  Get,
  UseGuards,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { Review } from './schemas/review.schema';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReturnReviewDto } from './dto/return-review.dto';
import { UserService } from 'src/User/user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from '../User/schemas/user.schema';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Headers } from '@nestjs/common';

@ApiTags('reviews')
@Controller('review')
export class ReviewController {
  constructor(
    private readonly reviewService: ReviewService,
    private readonly userService: UserService,
  ) {}

  @Get()
  async getAllReviews(): Promise<ReturnReviewDto[]> {
    const reviews = await this.reviewService.findAll();

    return await Promise.all(
      reviews.map(async (review) => {
        const returnReviewDto = new ReturnReviewDto();
        const user: User = await this.userService.findById(review.authorId);
        returnReviewDto.blogId = review.blogId;
        returnReviewDto.title = review.title;
        returnReviewDto.description = review.description;
        returnReviewDto.recommendActivity = review.recommendActivity;
        returnReviewDto.spendTime = review.spendTime;
        returnReviewDto.rating = review.rating;
        returnReviewDto.author = {
          _id: review.authorId,
          name: user.name,
          profile: user.profile,
        };
        returnReviewDto.score = review.score ? review.score : 0;
        returnReviewDto.images = review.images ? review.images : [];
        return returnReviewDto;
      }),
    );
  }

  @Get('/get-review-by-blog-id/:id')
  async getReviewsByBlogId(@Param('id') blogId: string) {
    const reviews = await this.reviewService.findAllbyBlogId(blogId);

    return await Promise.all(
      reviews.map(async (review) => {
        const returnReviewDto = new ReturnReviewDto();
        const user: User = await this.userService.findById(review.authorId);
        returnReviewDto.blogId = review.blogId;
        returnReviewDto.title = review.title;
        returnReviewDto.description = review.description;
        returnReviewDto.recommendActivity = review.recommendActivity;
        returnReviewDto.spendTime = review.spendTime;
        returnReviewDto.rating = review.rating;
        returnReviewDto.author = {
          _id: review.authorId,
          name: user.name,
          profile: user.profile,
        };
        returnReviewDto.score = review.score ? review.score : 0;
        returnReviewDto.images = review.images ? review.images : [];
        return returnReviewDto;
      }),
    );
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async createReview(
    @Headers() header: Record<string, string>,
    @Body() createReviewDto: CreateReviewDto,
  ): Promise<Review> {
    return await this.reviewService.create(header, createReviewDto);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async updateReview(
    @Param('id') id: string,
    @Body() review: UpdateReviewDto,
  ): Promise<Review> {
    return await this.reviewService.updateById(id, review);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async deleteReview(@Param('id') id: string): Promise<Review> {
    return await this.reviewService.deleteById(id);
  }
}
