import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export enum Category {
  BEACH = "ชายหาดและทะเล",
  SHOP = "ช็อปปิ้ง",
  HISTORY = "ประวัติศาสตร์ วัฒนธรรม และศาสนา",
  ENTERTAIN = "สวนสัตว์ สวนน้ำ และสวนสนุก",
  MESEUM = "พิพิธภัณฑ์ และแหล่งเรียนรู้ทางธรรมชาติ",
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

export class OpenTime {
  @Prop()
  day: Days;

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
