import { Body, Controller, Delete, Get, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BlogService } from './blog.service';
import { Blog } from './schemas/blog.schema';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@ApiTags('blogs')
@Controller('blogs')
export class BlogController {
    constructor(private blogService: BlogService) {}

    @Get()
    async getAllBlogs() {
        return await this.blogService.findAll();
    }

    @Post()
    @UsePipes(new ValidationPipe())
    async createNewBlog(@Body() blog: CreateBlogDto):Promise<Blog> {
        return await this.blogService.create(blog);
    }

    @Get(':id')
    async getBlog(@Param('id') id: string): Promise<Blog> {
        return await this.blogService.findById(id);
    }

    @Put(':id')
    async updateBlog(@Param('id') id: string, @Body() blog: UpdateBlogDto): Promise<Blog> {
        return await this.blogService.updateById(id, blog);
    }

    @Delete(':id')
    async deleteBlog(@Param('id') id: string): Promise<Blog> {
        return await this.blogService.deleteById(id);
    }
}
