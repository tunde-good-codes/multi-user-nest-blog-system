import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  UseInterceptors
} from "@nestjs/common";
import { CreateUserDto } from "./dtos/create.user.dto";
import { UserService } from "./user.service";
import { ApiTags } from "@nestjs/swagger";
import { CreateManyUsersDto } from "./dtos/create-many-users.dto";
import { Auth } from "src/auth/decorators/auth.decorators";
import { AuthType } from "src/auth/enum/auth-type.enum";

@Controller("user")
@ApiTags("Users")
export class UserController {
  constructor(private readonly userService: UserService) {}
  // @Get("/:id")
  // @ApiOperation({
  //   summary: "fetches a list of registered users on the application"
  // })
  // @ApiResponse({
  //   status: 200,
  //   description: "users fetched successfully based on query"
  // })
  // @ApiQuery({
  //   name: "limit",
  //   type: "number",
  //   required: false,
  //   description: "number of entry return for query",
  //   example: 10
  // })
  // @ApiQuery({
  //   name: "page",
  //   type: "number",
  //   required: false,
  //   description: "number of entry return for query",
  //   example: 1
  // })
  // getUsers(
  //   @Param() getUserParamDto: GetUserParamDto,
  //   @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number,
  //   @Query("page", new DefaultValuePipe(10), ParseIntPipe) page: number
  // ) {
  //   return this.userService.findAll(getUserParamDto, limit, page);
  // }
  @Auth(AuthType.None)
  @UseInterceptors(ClassSerializerInterceptor)
  @Post("/register")
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Post("register-many")
  createManyUser(@Body() createManyUsersDto: CreateManyUsersDto) {
    return this.userService.createManyUser(createManyUsersDto);
  }

  @Get("all-users")
  getAllUsers() {
    return this.userService.getAllUsers();
  }
}
