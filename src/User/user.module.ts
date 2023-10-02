import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';
import { AuthModule } from 'src/auth/auth.module';
import { User } from './user';

@Module({
    imports: [ MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]) ],
    controllers: [ UserController ],
    providers: [ UserService ],
    exports: [ UserService ]
})
export class UserModule {}
