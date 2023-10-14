import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { v4 as uuidv4 } from "uuid";

@Schema({ timestamps: true })
export class Review {
  @Prop({
    default: uuidv4(),
  })
  refToId?: string;

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

  @Prop({ default: 0 })
  score?: number; // vote-up, vote-down

  @Prop()
  images?: string[];
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
