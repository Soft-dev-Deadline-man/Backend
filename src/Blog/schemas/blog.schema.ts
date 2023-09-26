import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export class EntrancePrice {
  @Prop()
  ageRange: string;

  @Prop()
  price: string;
}

export class SeparateRating {
  @Prop()
  star: string;

  @Prop()
  quantity: string;
}

export class Contact {
  @Prop()
  name: string;

  @Prop()
  link: string;
}

@Schema({
  timestamps: true,
})
export class Blog {
  @Prop()
  title: string;

  @Prop()
  catagory: string;

  @Prop()
  entrancePrice: EntrancePrice[];

  @Prop()
  address: string;

  @Prop()
  rating: number;

  @Prop()
  separateRating: SeparateRating[];

  @Prop()
  reviews: any;

  @Prop()
  latitude: string;

  @Prop()
  longitude: string;

  @Prop()
  forbidden: string[];

  @Prop()
  contact: Contact[];

  @Prop()
  images: string[];
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
