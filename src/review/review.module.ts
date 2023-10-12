import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Review } from './review';
import { ReviewSchema } from './schemas/review.schema';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { UserModule } from 'src/User/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }]),
    UserModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('credential.jwt_secret'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService], // Inject your ConfigService
    }),
  ],
  controllers: [ReviewController],
  providers: [ReviewService],
  exports: [ReviewService],
})
export class ReviewModule {}
