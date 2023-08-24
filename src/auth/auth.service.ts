import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';
import { TokenPayload } from './interface/tokenPayload.interface';
import { AuthLogin } from './dto/auth-login.dto';
import { User } from '../User/schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserService } from 'src/User/user.service';

const client = new OAuth2Client(
  process.env.GOOGLE_OAUTH_CLIENTID,
  process.env.GOOGLE_OAUTH_CLIENTSECRET,
);

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async authenticateWithGoogleOAuth({ credential }: AuthLogin) {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_OAUTH_CLIENTID,
    });

    const { email } = ticket.getPayload();
    const user = await this.userService.findByEmail(email);
    if (!user) {
      const newUser = new this.userModel();
      newUser.email = email;
      await newUser.save();
      return {
        accessToken: this.generateAccessToken(newUser.id),
      };
    }

    const userEmail = await this.userService.findByEmailReturnId(user.email);

    return {
      accessToken: this.generateAccessToken(userEmail),
    };
  }

  private generateAccessToken(userId: string) {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload, {
      secret: 'some-secret',
      expiresIn: '1d',
    });
    return token;
  }
}
