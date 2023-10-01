import { Inject, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './User/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MinioClientModule } from './minio-client/minio-client.module';
import { ImageUploadModule } from './image-upload/image-upload.module';
import { ReviewModule } from './review/review.module';
import { AuthModule } from './auth/auth.module';
import { BlogModule } from './Blog/blog.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('mongo.uri'),
      }),
      inject: [ConfigService],
    }),
    UserModule,
    BlogModule,
    MinioClientModule,
    ImageUploadModule,
    ReviewModule,
    AuthModule,
    BlogModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
