import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UserModule } from "src/User/user.module";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from "src/User/schemas/user.schema";
import { ConfigService } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";
import { UserService } from "src/User/user.service";
import { MinioClientModule } from "src/minio-client/minio-client.module";
import { BlogModule } from "src/Blog/blog.module";

@Module({
  imports: [
    MinioClientModule,
    UserModule,
    BlogModule,
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>("credential.jwt_secret"),
        signOptions: { expiresIn: "1d" },
      }),
      inject: [ConfigService], // Inject your ConfigService
    }),
    MongooseModule.forFeature([{ name: "User", schema: UserSchema }]),
  ],
  controllers: [AuthController],
  providers: [JwtStrategy, AuthService, UserService],
  exports: [AuthService],
})
export class AuthModule {}
