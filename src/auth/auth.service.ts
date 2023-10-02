import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';
import { TokenPayload } from './interface/tokenPayload.interface';
import { User } from '../User/schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserService } from 'src/User/user.service';
import { AuthEmail, AuthGoogleLogin } from './dto/auth-login.dto';

const client = new OAuth2Client(
  process.env.GOOGLE_OAUTH_CLIENTID,
  process.env.GOOGLE_OAUTH_CLIENTSECRET,
);

const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async registWithEmailPassword({
    email,
    password,
    firstname,
    lastname,
  }: AuthEmail) {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      let hashedPassword;
      try {
        const saltRounds = 10; //can keep in .env
        hashedPassword = bcrypt.hashSync(password, saltRounds);
      } catch (err) {
        return {
          error: err,
        };
      }
      const newUser = new this.userModel({
        email: email,
        password: hashedPassword,
        firstName: firstname,
        lastName: lastname,
      });
      await newUser.save();

      return {
        accessToken: this.generateAccessToken(newUser.id),
      };
    }
  }

  async loginWithEmailPassword({ email, password }: AuthEmail) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('user not found');
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
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_OAUTH_CLIENTID,
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
      secret: 'some-secret', //can keep in .env
      expiresIn: '1d',
    });
    return token;
  }
}
