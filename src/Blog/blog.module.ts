import { Module } from "@nestjs/common";
import { Blog } from "./blog";
import { BlogController } from "./blog.controller";
import { BlogService } from "./blog.service";
import { MongooseModule } from "@nestjs/mongoose";
import { BlogSchema } from "./schemas/blog.schema";
import { RolesGuard } from "src/User/guard/roles.guard";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
  ],
  providers: [Blog, BlogService, RolesGuard],
  controllers: [BlogController],
  exports: [BlogService],
})
export class BlogModule {}
