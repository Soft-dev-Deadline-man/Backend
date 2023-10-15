import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from "./schemas/user.schema";
import { User } from "./user";
import { MinioClientModule } from "src/minio-client/minio-client.module";
import { BlogModule } from "src/Blog/blog.module";

@Module({
  imports: [
    MinioClientModule,
    BlogModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
