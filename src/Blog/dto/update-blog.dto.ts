export class UpdateBlogDto {
    readonly title: string;
    readonly description: string;
    readonly content: string;
    
    readonly authorID: string;
    readonly likes: number;
    readonly comment: string;
}