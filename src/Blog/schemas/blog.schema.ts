import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({
    timestamps: true,
})

export class Blog {
    @Prop()
    title: string;

    @Prop()
    description: string;

    @Prop()
    content: string;
    
    @Prop()
    authorID: string;

    @Prop()
    likes: number;

    @Prop()
    comment: string;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);