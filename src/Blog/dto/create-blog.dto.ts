import { IsNotEmpty, isNotEmpty } from 'class-validator';
import {
  Category,
  Contact,
  EntrancePrice,
  Forbidden,
  OpenTime,
  SeparateRating,
} from '../schemas/blog.schema';

export class CreateBlogDto {
  @IsNotEmpty()
  readonly title: string;

  @IsNotEmpty()
  readonly category: Category;
  readonly openTime: OpenTime[];
  readonly entrancePrice: EntrancePrice;

  @IsNotEmpty()
  readonly address: string;
  readonly rating: number;
  readonly separateRating: SeparateRating[];

  readonly reviews: any;

  @IsNotEmpty()
  readonly latitude: string;

  @IsNotEmpty()
  readonly longitude: string;

  readonly forbidden: Forbidden;
  readonly contact: Contact;
  readonly images: string[];
}
