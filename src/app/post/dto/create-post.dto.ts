import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsArray,
  IsEnum,
  IsInt,
  IsISO8601,
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
  ValidateNested
} from "class-validator";

import { Type } from "class-transformer";
import { postType } from "../enum/post-enum-types";
import { postStatus } from "../enum/post-status-type";
import { CreatePostMetaOptionsDto } from "../meta-options/create-post-meta-options.dto";

export class CreatePostDto {
  @ApiProperty({
    example: "This is a title",
    description: "This is the title for the blog post"
  })
  @IsString()
  @MinLength(4)
  @MaxLength(512)
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    enum: postType,
    description: "Possible values, 'post', 'page', 'story', 'series'"
  })
  @IsEnum(postType)
  @IsNotEmpty()
  postType: postType;

  @ApiProperty({
    description: "a slug should be in small lettering. For Example - 'my-url'",
    example: "my-blog-post"
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(256)
  @MinLength(4)
  slug: string;

  @ApiProperty({
    enum: postStatus,
    description: "Possible values 'draft', 'scheduled', 'review', 'published'"
  })
  @IsEnum(postStatus)
  @IsNotEmpty()
  status: postStatus;

  @ApiPropertyOptional({
    description: "This is the content of the post",
    example: "The post content"
  })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({
    description: "Serialize your JSON object else a validation error will be thrown"
  })
  @IsOptional()
  @IsJSON()
  schema?: string;

  @ApiPropertyOptional({
    description: "Featured image for your blog post",
    example: "http://localhost.com/images/image1.jpg"
  })
  @IsOptional()
  @MinLength(4)
  @MaxLength(1024)
  @IsUrl()
  featuredImageUrl?: string;
  @ApiPropertyOptional({
    description: "The date on which the blog post is published",
    example: "2024-03-16T07:46:32+0000"
  })
  @IsISO8601()
  @IsOptional()
  publishedOn?: string;

  @ApiPropertyOptional({
    description: "Array of tags passed as string values",
    example: [1, 2]
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  tags?: number[];

  @ApiPropertyOptional({
    type: "array",
    required: false,
    items: {
      type: "object",
      properties: {
        metaValue: {
          type: "json",
          description: "the meta-value is a json string/value",
          example: "{`sidebarEnabled`:true}"
        }
      }
    }
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreatePostMetaOptionsDto)
  metaOptions?: CreatePostMetaOptionsDto;

  @ApiProperty({
    type: "integer",
    required: true,
    example: 1
  })
  @IsInt()
  @IsNotEmpty()
  authorId: number;
}
