import { Contact, EntrancePrice } from '../schemas/blog.schema';

export class BlogSummaryDto {
  readonly title: string;
  readonly category: string;
  readonly entrancePrice: EntrancePrice;
  readonly contact: Contact;
}
