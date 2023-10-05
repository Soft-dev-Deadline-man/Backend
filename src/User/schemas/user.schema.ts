import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
  },
  collection: 'user',
})
export class User {
  @Prop()
  password: string;

  @Prop()
  email: string;

  @Prop()
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
