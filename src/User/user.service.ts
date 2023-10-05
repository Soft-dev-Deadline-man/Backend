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

  async findAll(): Promise<User[]> {
    const users = await this.userModel.find().exec();
    return users;
  }

  async create(user: User): Promise<User> {
    const createdUser = await this.userModel.create(user);
    return createdUser;
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = this.userModel.findOne({ email: email });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByEmailReturnId(email: string) {
    const user = this.userModel.findOne({ email: email });
    if (!user) {
      return null;
    }
    return (await user).id;
  }

  async findByIdAndChangePassword(id: string, password: string) {
    const user = this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    let hashedPassword;
    try {
      const saltRounds = this.configService.get<number>(
        'credential.bcrypt_salt_round',
      );
      hashedPassword = bcrypt.hashSync(password, saltRounds);
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
    return await this.userModel
      .findByIdAndUpdate(id, user, {
        new: true,
        runValidators: true,
      })
      .exec();
  }

  async deleteById(id: string): Promise<User> {
    return await this.userModel.findByIdAndDelete(id).exec();
  }
}
