import { Category, Contact, EntrancePrice, Forbidden, OpenTime, SeparateRating } from '../schemas/blog.schema';

export class CreateBlogDto {
  readonly title: string;
  readonly category: Category;
  readonly openTime: OpenTime[];
  readonly entrancePrice: EntrancePrice;

  readonly address: string;
  readonly rating: number;
  readonly separateRating: SeparateRating[];

  readonly reviews: any;
  readonly latitude: string;
  readonly longitude: string;

  readonly forbidden: Forbidden;
  readonly contact: Contact;
  readonly images: string[];
}
