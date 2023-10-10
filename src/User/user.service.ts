import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: mongoose.Model<User>,
    private readonly configService: ConfigService,
  ) {}

  async findAll(): Promise<unknown[]> {
    const users = await this.userModel.find();
    return users.map((user) => ({
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
      throw new NotFoundException('User not found');
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

  async findByEmailReturnId(email: string): Promise<string> {
    const user = await this.userModel.findOne({ email: email }).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user.id;
  }

  async changeUserProfile(id: string, image: string) {
    const user = this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return await this.userModel.findByIdAndUpdate(
      id,
      {
        ...user,
        profile: image,
      },
      {
        new: true,
      },
    );
  }

  async findByIdAndChangePassword(id: string, password: string) {
    const user = this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    let hashedPassword: string;
    try {
      const saltRounds = this.configService.get<number>(
        'credential.bcrypt_salt_round',
      );
      hashedPassword = bcrypt.hashSync(password, saltRounds as number);
    } catch (err) {
      return {
        error: err,
      };
    }

    return await this.userModel.findByIdAndUpdate(id, {
      password: hashedPassword,
    });
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
