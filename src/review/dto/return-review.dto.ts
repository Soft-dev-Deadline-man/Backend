export class ReturnReviewDto {
  blogId: string;
  author: {
    name: string;
    profile: string;
  };
  title: string;
  description: string;
  recommendActivity: string;
  spendTime: string;
  rating: number;
}
