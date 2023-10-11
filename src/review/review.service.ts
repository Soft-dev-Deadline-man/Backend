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

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name)
    private readonly reviewModel: mongoose.Model<Review>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async findAll(): Promise<Review[]> {
    return await this.reviewModel.find().exec();
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
      score: createReviewDto.score,
      images: createReviewDto.images,
    };
    return await this.reviewModel.create(review);
    // const token =
  }

  async updateById(id: string, review: Review): Promise<Review> {
    return (await this.reviewModel
      .findByIdAndUpdate({ _id: id }, review, {
        new: true,
        runValidators: true,
      })
      .exec()) as Review;
  }

  async deleteById(id: string): Promise<Review> {
    return (await this.reviewModel.findByIdAndDelete(id).exec()) as Review;
  }
}
