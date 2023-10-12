import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog } from './schemas/blog.schema';
import mongoose from 'mongoose';
import { BlogSummaryDto } from './dto/get-blog.dto';
import { CreateBlogDto } from './dto/create-blog.dto';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel(Blog.name)
    private readonly blogModel: mongoose.Model<Blog>,
  ) {}

  async findAll(): Promise<BlogSummaryDto[]> {
    const blogs = await this.blogModel.find().populate('reviews').exec();
    blogs.forEach((blog) => {
      if (blog.reviews === null) {
        blog.reviewLength = 0;
      } else {
        blog.reviewLength = blog.reviews.length;
      }
      if (blog.images === null) {
        blog.images = [];
      }
    });
    return blogs.map((blog) => ({
      _id: blog._id,
      title: blog.title,
      category: blog.category,
      rating: blog.rating,
      reviewLength: blog.reviewLength,
      address: blog.address,
      openTime: blog.openTime,
      firstImage: blog.images.length > 0 ? blog.images[0] : null,
    }));
  }

  async create(blog: CreateBlogDto): Promise<Blog> {
    return await this.blogModel.create(blog);
  }

  async findById(id: string): Promise<Blog> {
    const blog = await this.blogModel.findById(id).exec();

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    return blog;
  }

  async updateBlogReviwsById(id: string, reviewId: string): Promise<unknown> {
    const blog = await this.blogModel.findById(id).exec();
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    blog.reviews.push(reviewId);
    await this.blogModel.findByIdAndUpdate(
      id,
      {
        ...blog,
        reviews: blog.reviews,
      },
      {
        new: true,
      },
    );

    return blog;
  }

  async initBlogSeperateRatingById(
    id: string,
    score: number,
  ): Promise<unknown> {
    const blog = await this.blogModel.findById(id).exec();
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    if (score < 1 || score > 5) {
      throw new BadRequestException('Invalid score value');
    }
    const ratingProperty = `rate${score}`;
    blog.separateRating[ratingProperty] += 1;

    await this.blogModel.findByIdAndUpdate(
      id,
      {
        ...blog,
        seperateRating: blog.separateRating,
      },
      {
        new: true,
      },
    );

    return blog;
  }

  async updateBlogSeperateRatingById(
    blogId: string,
    userId: string,
    newScore: number,
  ): Promise<unknown> {
    const blog = await this.blogModel.findById(blogId).exec();
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }
    if (newScore < 1 || newScore > 5) {
      throw new BadRequestException('Invalid score value');
    }
    const previousScore = blog.rating[userId];

    if (previousScore !== undefined) {
      const previousRatingProperty = `rate${previousScore}`;
      blog.separateRating[previousRatingProperty] -= 1;
    }
    const newRatingProperty = `rate${newScore}`;
    blog.separateRating[newRatingProperty] += 1;
    blog.rating[userId] = newScore;
    const updatedBlog = await blog.save();
    return updatedBlog;
  }

  async updateImageById(
    id: string,
    images: string[] | undefined,
  ): Promise<unknown> {
    const blog = await this.blogModel.findById(id).exec();
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    let isUpdated = false;
    for (const inputImg in images) {
      let isSaved = false;
      for (const imageInDB in blog.images) {
        if (inputImg == imageInDB) {
          isSaved = true;
          break;
        }
      }
      if (!isSaved) {
        isUpdated = true;
        blog.images.push(inputImg);
      }
    }

    if (isUpdated) {
      return await this.blogModel.findByIdAndUpdate(
        id,
        {
          ...blog,
          images: blog.images,
        },
        {
          new: true,
        },
      );
    }

    return blog;
  }

  async updateById(id: string, blog: Blog): Promise<Blog> {
    return (await this.blogModel
      .findByIdAndUpdate(id, blog, {
        new: true,
        runValidators: true,
      })
      .exec()) as Blog;
  }

  async deleteById(id: string): Promise<Blog> {
    return (await this.blogModel.findByIdAndDelete(id).exec()) as Blog;
  }
}
