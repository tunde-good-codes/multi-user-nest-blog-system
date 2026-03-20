import { IsNotEmpty, IsString } from "class-validator";

// export class CreatePostMetaOptionsDto {
//   @IsNotEmpty()
//   @IsJSON()
//   metaValue: string;
// }

export class CreatePostMetaOptionsDto {
  @IsNotEmpty()
  @IsString()
  key: string;

  @IsNotEmpty()
  value: any;
}
