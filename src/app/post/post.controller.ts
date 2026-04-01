import type { ActiveUserData } from "./../auth/interface/active-user-data-interface";
import { Body, Controller, Delete, Get, ParseIntPipe, Patch, Post, Query } from "@nestjs/common";
import { PostService } from "./post.service";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";
import { GetPostsDto } from "./dto/get-post.dto";
import { ActiveUser } from "../auth/decorators/active-user-decorator";

@ApiTags("Post Section")
@Controller("post")
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  getPosts(@Query("userId") userId: number) {
    return this.postService.findAll(userId);
  }
  @Get("all")
  getAllPosts(@Query() postQuery: GetPostsDto) {
    return this.postService.findAllPosts(postQuery);
  }

  @ApiResponse({
    status: 201,
    description: "post created successfully"
  })
  @ApiOperation({
    summary: "create a new post"
  })
  @Post()
  createPost(@Body() createPostDto: CreatePostDto, @ActiveUser() user: ActiveUserData) {
    return this.postService.create(createPostDto, user);
  }

  @ApiOperation({ description: "deleted an existing   blog post" })
  @ApiResponse({
    status: 200,
    description: "post deleted successfully"
  })
  @Delete()
  deletePost(@Query("id", ParseIntPipe) id: number) {
    return this.postService.delete(id);
  }

  @ApiOperation({ description: "update an existing   blog post" })
  @ApiResponse({
    status: 200,
    description: "post updated successfully"
  })
  @Patch()
  updatePost(@Body() patchPostDto: UpdatePostDto) {
    return this.postService.update(patchPostDto);
  }
}
