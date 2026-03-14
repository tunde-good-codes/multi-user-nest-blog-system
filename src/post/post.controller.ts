import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreatePostDto } from "./dtos/create-post-dto";
import { UpdatePostDto } from "./dtos/updatePostDto";
import { PostsService } from "./post.service";
import { GetPostsDto } from "./dtos/get.posts.dto";
import { ActiveUser } from "src/auth/decorators/activeUserDecorator";
import type { ActiveUserData } from "src/auth/interfaces/activeUserDataInterface";

@Controller("post")
@ApiTags("Posts")
export class PostController {
  constructor(private readonly postService: PostsService) {}

  // @Get("/:userId")
  // getPosts(@Param("userId") userId: string) {
  //   return this.postService.findAll(userId);
  // }

  @ApiResponse({
    status: 201,
    description: "post created successfully"
  })
  @ApiOperation({ description: "create a new blog post" })
  @Post()
  createPost(@Body() createPostDto: CreatePostDto, @ActiveUser() user: ActiveUserData) {
    console.log(user);
  }

  @Get()
  getPosts(@Query() postQuery: GetPostsDto) {
    return this.postService.findAll(postQuery);
  }
  @Delete()
  deletePost(@Param("id", ParseIntPipe) id: number) {
    return this.postService.deletePost(id);
  }
  @ApiOperation({ description: "update a  blog post" })
  @ApiResponse({
    status: 200,
    description: "post updated successfully"
  })
  @Patch()
  updatePost(@Body() patchPostDto: UpdatePostDto) {
    return this.postService.update(patchPostDto);
  }
}
