/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Controller, Get, Param } from "@nestjs/common";
import { UserService } from "./providers/users.service";
import { ApiQuery, ApiTags } from "@nestjs/swagger";
import { GetUserParamDto } from "./dto/get-user-param-dto";

@Controller("user")
@ApiTags("User Section")
export class UserController {
  constructor(
    // injecting user-service here

    private readonly userService: UserService
  ) {}

  @Get("mine/:userId")
  findAll(@Param("userId") params: any) {
    console.log(params);
    return "get it all";
  }
  @ApiQuery({
    name: "limit",
    type: "number",
    required: false,
    description: "highest data to release per time"
  })
  @Get("{/:id}")
  findAUser(@Param() params: GetUserParamDto) {
    console.log(params);
    if (params.id) {
      return this.userService.findOne(params.id);
    }
  }
}
