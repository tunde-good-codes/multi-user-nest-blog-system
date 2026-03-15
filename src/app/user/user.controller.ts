import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
    console.log(createUserDto);

    return this.userService.create(createUserDto);
  }

  @Get("mine/:userId")
  findAll(@Param("userId") params: any) {
    console.log(params);

    return "get it all";
  }

  @Get("all")
  allUsers() {
    return "we are getting all users";
  }
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.userService.remove(+id);
  }
}
