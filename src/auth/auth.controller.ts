import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthLogin } from './dto/auth-login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login-google')
    async authenicateWithGoogleOAuth(@Body() authLogin: AuthLogin) {
        try {
            return await this.authService.authenticateWithGoogleOAuth(authLogin);
        }
        catch (err) {
            throw new HttpException('Google OAuth authentication failed', err.status);
        }
    }
}
