import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './User/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogModule } from './blog/blog.module';
import { MinioClientModule } from './minio-client/minio-client.module';
import { ImageUploadModule } from './image-upload/image-upload.module';
import { FileUploadModule } from './file-upload/file-upload.module';
import { ReviewModule } from './review/review.module';
import { AuthModule } from './auth/auth.module';
import { BlogModule } from './Blog/blog.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    UserModule,
    BlogModule,
    MinioClientModule,
    ImageUploadModule,
    FileUploadModule,
    ReviewModule,
    AuthModule,
    BlogModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
