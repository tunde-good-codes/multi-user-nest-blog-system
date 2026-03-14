import { CreatePostDto } from "./create-post-dto";
import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsInt, IsNotEmpty } from "class-validator";

export class UpdatePostDto extends PartialType(CreatePostDto) {
  @ApiProperty({
    description: "the id of the post that needs to be updated"
  })
  @IsInt()
  @IsNotEmpty()
  id: number;
}
