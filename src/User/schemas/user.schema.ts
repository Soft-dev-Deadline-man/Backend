import { ConfigService } from "@nestjs/config";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export enum UserRole {
  ADMIN = "admin",
  USER = "user",
}

@Schema({
  timestamps: true,
})
export class User {
  @Prop()
  password: string;

  @Prop()
  email: string;

  @Prop({
    type: String,
    default: (configService: ConfigService) =>
      configService.get("minio.endpoint") === "minio"
        ? `https://${configService.get("minio.endpoint")}.${configService.get(
            "domain",
          )}/picture-bucket/289f07480b8a5aec15ae3b537f58cf8f.jpg`
        : `http://${configService.get("minio.endpoint")}:${configService.get(
            "minio.port",
          )}/picture-bucket/289f07480b8a5aec15ae3b537f58cf8f.jpg`,
  })
  profile: string;

  @Prop()
  name: string;

  @Prop()
  role: UserRole;

  @Prop()
  bio: string;

  @Prop()
  bookmark: string[];

  @Prop()
  likedReview?: string[];

  @Prop()
  postedBlogs: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
