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
    default: `https://minio.pickausername.com/picture-bucket/profiles/default.jpg`,
  })
  profile: string;

  @Prop()
  name: string;

  @Prop({
    enum: UserRole,
    default: "user",
  })
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
