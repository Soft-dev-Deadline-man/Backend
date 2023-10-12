import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString } from 'class-validator';
import { BufferedFile } from 'src/minio-client/file.model';

export class FileUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  image: BufferedFile;
}
export class FileUploadMultipleDto {
  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
  images: BufferedFile[];

  @IsNumberString()
  reviewId: string;
}
