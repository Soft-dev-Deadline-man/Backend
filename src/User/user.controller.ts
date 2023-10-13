import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import { UserService } from './user.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from './common/decorator/user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { ChangeUserProfileDto } from './dto/update-user-profile.dto';

@ApiTags('users')
@Controller('users')
@ApiBearerAuth()
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async getAllUsers(): Promise<User[] | unknown[]> {
    return await this.userService.findAll();
  }

  @Get('user/me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getMe(@CurrentUser() user: User) {
    return await this.userService.findByEmail(user.email);
  }

  @Post('upload/image')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async changeUserProfile(
    @CurrentUser() user: User,
    @Body() image: ChangeUserProfileDto,
  ): Promise<unknown> {
    const id = await this.userService.findByEmailReturnId(user.email);
    return await this.userService.changeUserProfile(id, image.image);
  }

  @Post('add-bookmark/:blogId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async addBookmark(
    @CurrentUser() user: User,
    @Param('blogId') blogId: string,
  ): Promise<unknown> {
    const id = await this.userService.findByEmailReturnId(user.email);
    return await this.userService.addBookmarkByUserId(id, blogId);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createNewUser(@Body() user: CreateUserDto): Promise<User> {
    return await this.userService.create(user);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async getUser(@Param('id') id: string): Promise<User> {
    return await this.userService.findById(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async changePassword(
    @Param('id') id: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<User | unknown> {
    return await this.userService.findByIdAndChangePassword(
      id,
      changePasswordDto.password,
    );
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  async updateUser(
    @Param('id') id: string,
    @Body() user: UpdateUserDto,
  ): Promise<User> {
    return await this.userService.updateById(id, user);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<User> {
    return await this.userService.deleteById(id);
  }
}
