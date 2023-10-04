import { Contact } from '../schemas/blog.schema';

export class BlogSummaryDto {
    readonly title: string;
    readonly category: string;
    readonly ageRange: string;
    readonly price: string;
    readonly contact: Contact[]; 
  }
  