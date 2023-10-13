import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  Get,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
} from "@nestjs/common";
import { ReviewService } from "./review.service";
import { CreateReviewDto } from "./dto/create-review.dto";
import { Review } from "./schemas/review.schema";
import { UpdateReviewDto } from "./dto/update-review.dto";
import { ReturnReviewDto } from "./dto/return-review.dto";
import { UserService } from "src/User/user.service";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { User } from "../User/schemas/user.schema";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { CurrentUser } from "src/User/common/decorator/user.decorator";
import { BufferedFile } from "src/minio-client/file.model";
import { FilesInterceptor } from "@nestjs/platform-express";

@ApiTags("reviews")
@Controller("review")
export class ReviewController {
  constructor(
    private readonly reviewService: ReviewService,
    private readonly userService: UserService,
  ) {}

  @Get()
  async getAllReviews(): Promise<ReturnReviewDto[]> {
    const reviews = await this.reviewService.findAll();

    return await Promise.all(
      reviews.map(async (review) => {
        const returnReviewDto = new ReturnReviewDto();
        const user: User = await this.userService.findById(review.authorId);
        returnReviewDto.blogId = review.blogId;
        returnReviewDto.title = review.title;
        returnReviewDto.description = review.description;
        returnReviewDto.recommendActivity = review.recommendActivity;
        returnReviewDto.spendTime = review.spendTime;
        returnReviewDto.rating = review.rating;
        returnReviewDto.author = {
          _id: review.authorId,
          name: user.name,
          profile: user.profile,
        };
        returnReviewDto.score = review.score ? review.score : 0;
        returnReviewDto.images = review.images ? review.images : [];
        return returnReviewDto;
      }),
    );
  }

  @Get("/get-review-by-blog-id/:id")
  async getReviewsByBlogId(@Param("id") blogId: string) {
    const reviews = await this.reviewService.findAllbyBlogId(blogId);

    return await Promise.all(
      reviews.map(async (review) => {
        const returnReviewDto = new ReturnReviewDto();
        const user: User = await this.userService.findById(review.authorId);
        returnReviewDto.blogId = review.blogId;
        returnReviewDto.title = review.title;
        returnReviewDto.description = review.description;
        returnReviewDto.recommendActivity = review.recommendActivity;
        returnReviewDto.spendTime = review.spendTime;
        returnReviewDto.rating = review.rating;
        returnReviewDto.author = {
          _id: review.authorId,
          name: user.name,
          profile: user.profile,
        };
        returnReviewDto.score = review.score ? review.score : 0;
        returnReviewDto.images = review.images ? review.images : [];
        return returnReviewDto;
      }),
    );
  }

  @Post()
  @UseInterceptors(FilesInterceptor("images", 10))
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    type: CreateReviewDto,
  })
  async createReview(
    @UploadedFiles() images: BufferedFile[],
    @CurrentUser() user: User,
    @Body() createReviewDto: CreateReviewDto,
  ): Promise<Review> {
    console.log("Files", images);
    return await this.reviewService.create(user, createReviewDto, images);
  }

  @Patch(":id")
  @UseInterceptors(FilesInterceptor("images", 10))
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    type: UpdateReviewDto,
  })
  async updateReview(
    @UploadedFiles() images: BufferedFile[],
    @Param("id") id: string,
    @Body() review: UpdateReviewDto,
  ): Promise<Review> {
    console.log(images);
    return await this.reviewService.updateById(id, review, images);
  }

  @Delete(":id")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async deleteReview(@Param("id") id: string): Promise<Review> {
    return await this.reviewService.deleteById(id);
  }
}
