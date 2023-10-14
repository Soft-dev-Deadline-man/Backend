import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { BlogService } from "./blog.service";
import { Blog } from "./schemas/blog.schema";
import { CreateBlogDto } from "./dto/create-blog.dto";
import { UpdateBlogDto } from "./dto/update-blog.dto";
import { BlogAllDatadto, BlogSummaryDto } from "./dto/get-blog.dto";

@ApiTags("blogs")
@Controller("blogs")
export class BlogController {
  constructor(private blogService: BlogService) {}

  @Get()
  async getAllBlogs() {
    return await this.blogService.findAll();
  }

  @Post()
  async createNewBlog(@Body() blog: CreateBlogDto): Promise<Blog> {
    return await this.blogService.create(blog);
  }

  @Get(":id")
  async getBlog(@Param("id") id: string): Promise<Blog> {
    return await this.blogService.findById(id);
  }

  @Get("/brief/:id")
  async getBriefBlogById(@Param("id") id: string): Promise<BlogSummaryDto> {
    return await this.blogService.findBriefBlogById(id);
  }

  @Get("/all-data/:id")
  async getAllDataBlogById(@Param("id") id: string): Promise<BlogAllDatadto> {
    return await this.blogService.findAllDataBlogById(id);
  }

  @Put(":id")
  async updateBlog(
    @Param("id") id: string,
    @Body() blog: UpdateBlogDto,
  ): Promise<Blog> {
    return await this.blogService.updateById(id, blog);
  }

  @Delete(":id")
  async deleteBlog(@Param("id") id: string): Promise<Blog> {
    return await this.blogService.deleteById(id);
  }
}
