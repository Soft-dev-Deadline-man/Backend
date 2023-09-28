import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { now } from 'mongoose';
import { Review } from 'src/review/schemas/review.schema';

export enum Category {
  beach = "ชายหาดและทะเล",
  shop = "ช็อปปิ้ง",
  history = "ประวัติศาสตร์ วัฒนธรรม และศาสนา",
  entertain = "สวนสัตว์ สวนน้ำ และสวนสนุก",
  meseum = "พิพิธภัณฑ์ และแหล่งเรียนรู้ทางธรรมชาติ",
}

export enum Days {
  MONDAY = "จันทร์",
  TUESDAY = "อังคาร",
  WEDNESDAY = "พุธ",
  THURSDAY = "พฤหัสบดี",
  FRIDAY = "ศุกร์",
  SATURDAY = "เสาร์",
  SUNDAY = "อาทิตย์",
}

export enum forbidden {
  animal = "",
  smoke = "",
  alcohol = "",
}

export enum contact {
  tel = "",
  website = "",
  facebook = "",
  ig = ""
}

export enum entrancePrice {
  child = "",
  adult = "",
  foreign = "",
}

export class OpenTime {
  @Prop()
  day: {
    start: Days;
    end: Days;
  }

  @Prop()
  time: string;
}

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
  category: Category;

  @Prop()
  openTime: OpenTime[];

  @Prop()
  entrancePrice: EntrancePrice;

  @Prop()
  address: string;

  @Prop()
  rating: number;

  @Prop()
  separateRating: SeparateRating[];

  @Prop()
  reviews: Review[];

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

  @Prop({default: now()})
  createdAt: Date;

  @Prop({default: now()})
  updatedAt: Date;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
