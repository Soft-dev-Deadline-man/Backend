import { Contact, EntrancePrice, SeparateRating } from '../schemas/blog.schema';

export class UpdateBlogDto {
  readonly title: string;
  readonly catagory: string;
  readonly entrancePrice: EntrancePrice[];

  readonly address: string;
  readonly rating: number;
  readonly separateRating: SeparateRating[];

  readonly reviews: any;
  readonly latitude: string;
  readonly longitude: string;

  readonly forbidden: string[];
  readonly contact: Contact[];
  readonly images: string[];
}
