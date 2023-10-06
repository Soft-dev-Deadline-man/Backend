import { Module } from '@nestjs/common';
import { Blog } from './blog';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogSchema } from './schemas/blog.schema';
import { UserModule } from 'src/User/user.module';
import { ReviewModule } from 'src/review/review.module';

@Module({
  imports: [
    UserModule,
    ReviewModule,
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
  ],
  providers: [Blog, BlogService],
  controllers: [BlogController],
})
export class BlogModule {}
