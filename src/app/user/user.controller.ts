/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Body, Controller, Delete, Get, Post, Query } from "@nestjs/common";
import { UserService } from "./providers/users.service";
import { ApiTags } from "@nestjs/swagger";
import { CreateUserDto } from "./dto/create-user.dto";
import { CreateManyUsersDto } from "./dto/create-many-userss.dto";
import { Auth } from "../auth/decorators/auth.decorators";
import { AuthType } from "../auth/enum/auth.enum";

@Controller("user")
@ApiTags("User Section")
export class UserController {
  constructor(
    // injecting user-service here

    private readonly userService: UserService
  ) {}

  @Auth(AuthType.None)
  @Get()
  getAll() {
    return this.userService.findAll();
  }

  @Auth(AuthType.None)
  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }
  @Post("many-create")
  createManyUsers(@Body() createUsersDto: CreateManyUsersDto) {
    return this.userService.createMany(createUsersDto);
  }
  @Delete("many-create")
  deleteUser(@Query("userId") userId: number) {
    return this.userService.deleteById(userId);
  }

  // @ApiOperation({ description: "it fetches a list of selected users" })
  // @ApiResponse({
  //   status: 200,
  //   description: "list of selected users successfully based om query"
  // })
  // @ApiQuery({
  //   name: "limit",
  //   type: "number",
  //   required: true,
  //   description: "the number of entries return per query",
  //   example: 10
  // })
  // @ApiQuery({
  //   name: "page",
  //   type: "number",
  //   required: true,
  //   description: "the position of the page number you want the api to  return",
  //   example: 6
  // })
  // @Get("/:id?")
  // findAUser(
  //   @Param() params: GetUserParamDto,
  //   @Query("limit", new DefaultValuePipe(1), ParseIntPipe) limit: number,
  //   @Query("page", new DefaultValuePipe(4), ParseIntPipe) page: number
  // ) {
  //   if (params.id) {
  //     return this.userService.findOne(params.id, limit, page);
  //   }
  // }
}
