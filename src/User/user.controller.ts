import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import { UserService } from './user.service';
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';

@ApiTags('users')
@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}

    @Get()
    async getAllUsers(): Promise<User[]> {
        return await this.userService.findAll();
    }

    @Post()
    async createNewUser(@Body() user: CreateUserDto): Promise<User> {
        return await this.userService.create(user);
    }

    @Get(':id')
    async getUser(@Param('id') id: string): Promise<User> {
        return await this.userService.findById(id);
    }

    @Put(':id')
    async updateUser(@Param('id') id: string, @Body() user: UpdateUserDto): Promise<User> {
        return await this.userService.updateById(id, user);
    }

    @Get('email/:email')
    async getUserByEmail(@Param('email') email: string): Promise<User> {
        return await this.userService.findByEmail(email);
    }

    @Delete(':id')
    async deleteUser(@Param('id') id: string): Promise<User> {
        return await this.userService.deleteById(id);
    }
}
