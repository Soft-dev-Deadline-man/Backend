import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog } from './schemas/blog.schema';
import mongoose from 'mongoose';

@Injectable()
export class BlogService {
    constructor(
        @InjectModel(Blog.name)
        private readonly blogModel: mongoose.Model<Blog>
    ) {}

    async findAll(): Promise<Blog[]> {
        const blogs = await this.blogModel.find().exec();
        return blogs;
    }

    async create(blog: Blog): Promise<Blog> {
        const createdBlog = await this.blogModel.create(blog);
        return createdBlog;
    }

    async findById(id: string): Promise<Blog> {
        const blog = await this.blogModel.findById(id).exec();

        if(!blog){
            throw new NotFoundException('Blog not found');
        }

        return blog;
    }

    async updateById(id: string, blog: Blog): Promise<Blog> {
        return await this.blogModel.findByIdAndUpdate(id, blog, {
            new: true,
            runValidators: true,
        }).exec();
    }

    async deleteById(id: string): Promise<Blog> {
        return await this.blogModel.findByIdAndDelete(id).exec();
    }
}
