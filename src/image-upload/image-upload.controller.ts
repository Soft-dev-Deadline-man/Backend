import { FileInterceptor } from '@nestjs/platform-express';
import { ImageUploadService } from './image-upload.service';
import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { BufferedFile } from '../minio-client/file.model';

@Controller('image-upload')
export class ImageUploadController {
    constructor(private imageUploadService: ImageUploadService) {}
    
    @Post()
    @UseInterceptors(FileInterceptor('image'))
    async uploadImage(@UploadedFile() image: BufferedFile) {
        return await this.imageUploadService.uploadImage(image);
    }
}
