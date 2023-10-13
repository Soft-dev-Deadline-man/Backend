import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Review } from './schemas/review.schema';
import mongoose from 'mongoose';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { BlogService } from 'src/Blog/blog.service';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name)
    private readonly reviewModel: mongoose.Model<Review>,
    private readonly blogService: BlogService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async findAll(): Promise<Review[]> {
    return await this.reviewModel.find().exec();
  }

  async findAllbyBlogId(blogId: string): Promise<Review[]> {
    return await this.reviewModel.find({ blogId: blogId }).exec();
  }

  async create(
    header: Record<string, string>,
    createReviewDto: CreateReviewDto,
  ): Promise<Review> {
    if (!header.authorization) {
      throw new NotFoundException('Not Login');
    }
    const userId = this.jwtService.verify(header.authorization.split(' ')[1], {
      secret: this.configService.get<string>('credential.jwt_secret'),
    }).userId;
    if (!userId) {
      throw new NotAcceptableException('Token is not valid');
    }
    const review: Review = {
      blogId: createReviewDto.blogId,
      authorId: userId,
      title: createReviewDto.title,
      description: createReviewDto.description,
      recommendActivity: createReviewDto.recommendActivity,
      spendTime: createReviewDto.spendTime,
      rating: createReviewDto.rating,
    };

    this.blogService.updateImageById(review.blogId, review.images);

    const reviewSaved = await this.reviewModel.create(review);
    await this.blogService.updateBlogReviwsById(review.blogId, reviewSaved.id);
    await this.blogService.updateBlogSeparateRatingById(
      review.blogId,
      reviewSaved.rating,
    );
    await this.blogService.calculateOverallRating(review.blogId);

    return reviewSaved.save();
  }

  async updateById(id: string, review: Review): Promise<Review> {
    const savedReview = await this.reviewModel.findById(id).exec();
    if (!savedReview) {
      throw new NotFoundException('Review not found');
    }

    const previousRating = savedReview.rating;
    const newRating = review.rating;

    if (newRating && previousRating !== newRating) {
      // console.log('Activated');
      await this.blogService.deleteBlogSeparateRatingById(
        savedReview.blogId,
        previousRating,
      );
      await this.blogService.updateBlogSeparateRatingById(
        savedReview.blogId,
        newRating,
      );
    }

    return (await this.reviewModel
      .findByIdAndUpdate({ _id: id }, review, {
        new: true,
        runValidators: true,
      })
      .exec()) as Review;
  }

  async deleteById(id: string): Promise<Review> {
    const reviewSaved = await this.reviewModel.findById(id);
    if (!reviewSaved) {
      throw new NotAcceptableException('Token is not valid');
    }
    await this.blogService.updateBlogReviwsById(
      reviewSaved.blogId,
      reviewSaved.id,
      false,
    );
    await this.blogService.deleteBlogSeparateRatingById(
      reviewSaved.blogId,
      reviewSaved.rating,
    );
    await this.blogService.calculateOverallRating(reviewSaved.blogId);
    return (await this.reviewModel.findByIdAndDelete(id).exec()) as Review;
  }
}
