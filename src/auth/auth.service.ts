import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';
import { TokenPayload } from './interface/tokenPayload.interface';
import { User } from '../User/schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserService } from 'src/User/user.service';
import { AuthEmail, AuthGoogleLogin } from './dto/auth-login.dto';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async registWithEmailPassword({ email, password, name }: AuthEmail) {
    try {
      const user = await this.userService.findByEmail(email);
      if (!user) {
        const saltRounds = this.configService.get<number>(
          'credential.bcrypt_salt_round',
        );
        // console.log(email, password, name);
        // const hashedPassword = bcrypt.hashSync(password, saltRounds);
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        // console.log(hashedPassword);

        const newUser = new this.userModel({
          email: email,
          password: hashedPassword,
          name: name,
        });

        await newUser.save();

        return {
          accessToken: this.generateAccessToken(newUser.id),
        };
      } else {
        return {
          error: 'User with this email already exists',
        };
      }
    } catch (error) {
      // Log the error for debugging purposes
      // console.error('Error in registWithEmailPassword:', error);
      return {
        error: 'Registration failed',
      };
    }
  }

  async loginWithEmailPassword({ email, password }: AuthEmail) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      return {
        error: 'user not found',
      };
      // throw new NotFoundException('user not found');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const userId = await this.userService.findByEmailReturnId(user.email);
      return {
        accessToken: this.generateAccessToken(userId),
      };
    } else {
      return {
        error: 'wrong password',
      };
    }
  }

  async authenticateWithGoogleOAuth({ credential }: AuthGoogleLogin) {
    const client = new OAuth2Client(
      this.configService.get<string>('oauth.id'),
      this.configService.get<string>('oauth.secret'),
    );
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: this.configService.get('oauth.id'),
    });

    const { email, name, family_name, picture } = ticket.getPayload();
    const user = await this.userService.findByEmail(email);
    if (!user) {
      const newUser = new this.userModel({
        email: email,
        name: name + ' ' + family_name,
        profile: picture,
      });
      await newUser.save();
      return {
        accessToken: this.generateAccessToken(newUser.id),
      };
    }

    const userId = await this.userService.findByEmailReturnId(user.email);

    return {
      accessToken: this.generateAccessToken(userId),
    };
  }

  private generateAccessToken(userId: string) {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('credential.jwt_secret'),
      expiresIn: '1d',
    });
    return token;
  }
}
