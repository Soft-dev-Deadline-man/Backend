import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Review {
  @Prop()
  blogId: string;

  @Prop()
  authorId: string;

  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  recommendActivity: string;

  @Prop()
  spendTime: string;

  @Prop()
  rating: number;

  @Prop()
  score: number; //vote-up, vote-down

  @Prop()
  images: string[];
}
