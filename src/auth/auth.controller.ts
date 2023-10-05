import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthGoogleLogin, AuthEmail, RegistEmail } from './dto/auth-login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login-google')
  async authenicateWithGoogleOAuth(@Body() authLogin: AuthGoogleLogin) {
    try {
      return await this.authService.authenticateWithGoogleOAuth(authLogin);
    } catch (err) {
      return {
        error: 'Google OAuth failed',
      };
      // throw new HttpException('Google OAuth authentication failed', err.status);
    }
  }

  @Post('regist-email')
  async registWithEmailPassword(@Body() authEmail: RegistEmail) {
    try {
      return await this.authService.registWithEmailPassword(authEmail);
    } catch (err) {
      // throw new HttpException('Register failed', err.status);
      return {
        error: 'Register failed',
      };
    }
  }

  @Post('login-email')
  async loginWithEmailPassword(@Body() authEmail: AuthEmail) {
    try {
      return await this.authService.loginWithEmailPassword(authEmail);
    } catch (err) {
      return {
        error: 'Login failed',
      };
      // throw new HttpException('Login failed', err.status);
    }
  }
}
