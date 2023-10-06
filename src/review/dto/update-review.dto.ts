export class UpdateReviewDto {
  readonly blogId: string;
  readonly authorId: string;
  readonly title: string;
  readonly description: string;
  readonly recommendActivity: string;
  readonly spendTime: string;
  readonly rating: number;
  readonly score: number;
  readonly images: string[];
}
