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
    return await this.reviewModel.find().exec();
  }

  async create(review: Review): Promise<Review> {
    return await this.reviewModel.create(review);
  }

  async updateById(id: string, review: Review): Promise<Review> {
    return (await this.reviewModel
      .findByIdAndUpdate(id, review, {
        new: true,
        runValidators: true,
      })
      .exec()) as Review;
  }

  async deleteById(id: string): Promise<Review> {
    return (await this.reviewModel.findByIdAndDelete(id).exec()) as Review;
  }
}
