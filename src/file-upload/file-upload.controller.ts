import { Controller, Post, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { BufferedFile } from 'src/minio-client/file.model';

@Controller('file-upload')
export class FileUploadController {
    constructor(
        private readonly fileUploadService: FileUploadService,
    ) {}

    @Post('single_image')
    @UseInterceptors(FileInterceptor('image'))
    async uploadSingleImage(
        @UploadedFile() image: BufferedFile,
    ) {
        return await this.fileUploadService.uploadSingleImage(image);
    }

    @Post('multiple_images')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'image1', maxCount: 1 },
        { name: 'image2', maxCount: 1 },
    ]))
    async uploadMultipleImages(
        @UploadedFiles() images: BufferedFile[],
    ) {
        return await this.fileUploadService.uploadMultipleImages(images);
    }

}
