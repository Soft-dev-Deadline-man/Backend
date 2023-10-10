import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  testJwt(): string {
    return 'correct Jwt, you can access with Jwt.';
  }
}
