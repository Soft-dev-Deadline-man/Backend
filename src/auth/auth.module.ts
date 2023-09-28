import { User } from './../User/user';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/User/user.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/User/schemas/user.schema';
import { UserService } from 'src/User/user.service';

@Module({
    imports: [ 
        UserModule, 
        JwtModule.register({ secret: 'some-secret', signOptions: { expiresIn: '1d' }}),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
    ],
    controllers: [ AuthController ],
    providers: [ AuthService, UserService, ],
    exports: [ AuthService ]
})
export class AuthModule {}
