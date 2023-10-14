import {
  HttpException,
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "./schemas/user.schema";
import * as mongoose from "mongoose";
import * as bcrypt from "bcrypt";
import { ConfigService } from "@nestjs/config";
import { BufferedFile } from "src/minio-client/file.model";
import { MinioClientService } from "src/minio-client/minio-client.service";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: mongoose.Model<User>,
    private readonly configService: ConfigService,
    private readonly minioClientService: MinioClientService,
  ) {}

  async findAll(): Promise<unknown[]> {
    const users: User[] = await this.userModel.find();
    return users.map((user: User) => ({
      profile: user.profile,
      name: user.name,
      bio: user.bio,
      bookmark: user.bookmark,
      postedBlogs: user.postedBlogs,
    }));
  }

  async create(user: User): Promise<User> {
    return await this.userModel.create(user);
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = (await this.userModel
      .findOne({ email: email })
      .exec()) as User;
    if (!user) {
      return null;
    }

    return user;
  }

  async likeReviewByUserId(userId: string, reviewId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException("User not found");

    var likedReview = user.likedReview;
    if (!likedReview) likedReview = [];
    for (const review in likedReview) {
      if (review == reviewId)
        throw new BadRequestException("user is already liked this blog");
    }
    likedReview.push(reviewId);

    await this.userModel.findByIdAndUpdate(
      userId,
      {
        ...user,
        likedReview: likedReview,
      },
      {
        new: true,
      },
    );

    return "like blog successful";
  }

  async unLikeReviewByUserId(userId: string, reviewId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException("User not found");

    var likedReview = user.likedReview;
    if (!likedReview) likedReview = [];

    const index = likedReview.indexOf(reviewId);
    if (index == undefined)
      throw new NotFoundException("User never like this review");
    likedReview.splice(index, 1);

    await this.userModel.findByIdAndUpdate(
      userId,
      {
        ...user,
        likedReview: likedReview,
      },
      {
        new: true,
      },
    );

    return "unlike blog successful";
  }

  async addBookmarkByUserId(userId: string, bookmarkId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException("User not found");

    const bookmarkUser = user.bookmark;
    for (const bookmark in bookmarkUser) {
      if (bookmark == bookmarkId)
        throw new BadRequestException("user is already bookmarked this blog");
    }
    bookmarkUser.push(bookmarkId);

    await this.userModel.findByIdAndUpdate(
      userId,
      {
        ...user,
        bookmark: bookmarkUser,
      },
      {
        new: true,
      },
    );

    return "add bookmark successful";
  }

  async deleteBookmarkByUserId(userId: string, bookmarkId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException("User not found");

    const bookmarkUser = user.bookmark;

    console.log(bookmarkUser + " " + bookmarkId);
    const index = bookmarkUser.indexOf(bookmarkId);
    console.log(index);
    if (index == undefined)
      throw new NotFoundException("User never bookmarks this blog");
    bookmarkUser.splice(index, 1);

    await this.userModel.findByIdAndUpdate(
      userId,
      {
        ...user,
        bookmark: bookmarkUser,
      },
      {
        new: true,
      },
    );

    return "delete bookmark successful";
  }

  async findByEmailReturnId(email: string): Promise<string> {
    const user = await this.userModel.findOne({ email: email }).exec();
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return user.id;
  }

  async changeUserProfile(id: string, image: BufferedFile) {
    const user = this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException("User not found");
    }

    try {
      const uploaded_image = await this.minioClientService.upload(image);
      return await this.userModel.findByIdAndUpdate(
        id,
        {
          ...user,
          profile: uploaded_image.url,
        },
        {
          new: true,
        },
      );
    } catch (err) {
      return {
        status:
          err instanceof HttpException
            ? err.message
            : "Unknown error encountered",
        message: "Profile image uploaded failed.",
      };
    }
  }

  async findByIdAndChangePassword(id: string, password: string) {
    const user = this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException("User not found");
    }

    let hashedPassword: string;
    try {
      const saltRounds = this.configService.get<number>(
        "credential.bcrypt_salt_round",
      );
      hashedPassword = bcrypt.hashSync(password, saltRounds as number);
    } catch (err) {
      return {
        error: err,
      };
    }

    await this.userModel.findByIdAndUpdate(id, {
      password: hashedPassword,
    });

    return "Update password successful";
  }

  async updateById(id: string, user: User): Promise<User> {
    return (await this.userModel
      .findByIdAndUpdate(id, user, {
        new: true,
        runValidators: true,
      })
      .exec()) as User;
  }

  async deleteById(id: string): Promise<User> {
    return (await this.userModel.findByIdAndDelete(id).exec()) as User;
  }
}
