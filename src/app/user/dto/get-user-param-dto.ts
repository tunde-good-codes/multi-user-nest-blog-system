import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional } from "class-validator";

export class GetUserParamDto {
  @ApiPropertyOptional({
    description: "get user with an id",
    example: 1
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  id?: number;
}
