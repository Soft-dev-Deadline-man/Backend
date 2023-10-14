import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNumber, IsOptional, IsString, Max, Min } from "class-validator";
import { BufferedFile } from "src/minio-client/file.model";
import { EmptyStringToUndefinedPipe } from "../pipe/emptyStringToUndefined.pipe";
import { StringToArrayStringPipe } from "../pipe/stringToArrayString.pipe";

export class UpdateReviewDto {
  @IsOptional()
  @IsString()
  @Transform((value) => EmptyStringToUndefinedPipe.transform(value))
  readonly title?: string;

  @IsOptional()
  @IsString()
  @Transform((value) => EmptyStringToUndefinedPipe.transform(value))
  readonly description?: string;

  @IsOptional()
  @IsString()
  @Transform((value) => EmptyStringToUndefinedPipe.transform(value))
  readonly recommendActivity?: string;

  @IsOptional()
  @IsString()
  @Transform((value) => EmptyStringToUndefinedPipe.transform(value))
  readonly spendTime?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  @Transform((value) => {
    return EmptyStringToUndefinedPipe.transform(value)
      ? (parseInt(EmptyStringToUndefinedPipe.transform(value)) as number)
      : undefined;
  })
  readonly rating?: number;

  @IsOptional({ each: true })
  @Transform((value) => StringToArrayStringPipe.transform(value))
  @ApiProperty({ type: "array", items: { type: "string" } })
  readonly oldImages?: string[];

  @IsOptional()
  @ApiProperty({ type: "array", items: { type: "string", format: "binary" } })
  readonly images?: BufferedFile[];
}
