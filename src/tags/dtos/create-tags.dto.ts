import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength
} from "class-validator";

export class CreateTagDto {
  @ApiProperty()
  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  @MaxLength(256)
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(512)
  slug: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsJSON()
  schema: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  @MaxLength(1024)
  featuredImage: string;
}
