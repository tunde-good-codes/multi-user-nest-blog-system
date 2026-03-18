/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Controller, Get, Param } from "@nestjs/common";
import { UserService } from "./providers/users.service";
import { ApiTags } from "@nestjs/swagger";
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
  @Get("{/:id}")
  findAUser(@Param("id") params: GetUserParamDto) {
    console.log(params);

    return this.userService.findOne(99);
  }
}
