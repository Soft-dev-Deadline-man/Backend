import { OpenTime } from '../schemas/blog.schema';

export class BlogSummaryDto {
  readonly title: string;
  readonly category: string;
  readonly rating: number;
  readonly reviewLength: number;
  readonly address: string;
  readonly openTime: OpenTime[];
  readonly firstImage: string | null;
}
