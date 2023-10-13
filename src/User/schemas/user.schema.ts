import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
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
    default:
      process.env.MINIO_ENDPOINT === 'minio'
        ? // Production
          `https://${process.env.MINIO_ENDPOINT}.${process.env.DOMAIN_NAME}/picture-bucket/289f07480b8a5aec15ae3b537f58cf8f.jpg`
        : // Development
          `https://${process.env.MINIO_ENDPOINT}.com/picture-bucket/289f07480b8a5aec15ae3b537f58cf8f.jpg`,
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
  postedBlogs: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
