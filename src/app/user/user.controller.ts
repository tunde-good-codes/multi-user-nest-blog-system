/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Query } from "@nestjs/common";
import { UserService } from "./providers/users.service";
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
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

  @ApiOperation({ description: "it fetches a list of selected users" })
  @ApiResponse({
    status: 200,
    description: "list of selected users successfully based om query"
  })
  @ApiQuery({
    name: "limit",
    type: "number",
    required: true,
    description: "the number of entries return per query",
    example: 10
  })
  @ApiQuery({
    name: "page",
    type: "number",
    required: true,
    description: "the position of the page number you want the api to  return",
    example: 6
  })
  @Get("/:id?")
  findAUser(
    @Param() params: GetUserParamDto,
    @Query("limit", new DefaultValuePipe(1), ParseIntPipe) limit: number,
    @Query("page", new DefaultValuePipe(4), ParseIntPipe) page: number
  ) {
    console.log(params);
    if (params.id) {
      return this.userService.findOne(params.id, limit, page);
    }
  }
}
