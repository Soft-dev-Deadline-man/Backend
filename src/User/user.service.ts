import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import * as mongoose from 'mongoose';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) 
        private readonly userModel: mongoose.Model<User>,
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

        if(!user){
            throw new NotFoundException('User not found');
        }
        
        return user;
    }

    async updateById(id: string, user: User): Promise<User> {
        return await this.userModel.findByIdAndUpdate(id, user, {
            new: true,
            runValidators: true,
        }).exec();
    }

    async deleteById(id: string): Promise<User> {
        return await this.userModel.findByIdAndDelete(id).exec();
    }
}
