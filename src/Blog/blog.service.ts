import { Injectable, NotFoundException } from '@nestjs/common';
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

  async create(blog: CreateBlogDto): Promise<CreateBlogDto> {
    return await this.blogModel.create(blog);
  }

  async findById(id: string): Promise<Blog> {
    const blog = await this.blogModel.findById(id).exec();

    if (!blog) {
      throw new NotFoundException('Blog not found');
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
