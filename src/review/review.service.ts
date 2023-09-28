import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Review } from './schemas/review.schema';
import mongoose from 'mongoose';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name)
    private readonly reviewModel: mongoose.Model<Review>,
  ) {}

  async findAll(): Promise<Review[]> {
    const reviews = await this.reviewModel.find().exec();
    return reviews;
  }

  async create(review: Review): Promise<Review> {
    const createedReview = await this.reviewModel.create(review);
    return createedReview;
  }

  async updateById(id: string, review: Review): Promise<Review> {
    return await this.reviewModel
      .findByIdAndUpdate(id, review, {
        new: true,
        runValidators: true,
      })
      .exec();
  }

  async deleteById(id: string): Promise<Review> {
    return await this.reviewModel.findByIdAndDelete(id).exec();
  }
}
