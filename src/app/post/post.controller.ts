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
import { PostService } from "./post.service";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";

@ApiTags("Post Section")
@Controller("post")
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get("{/:userId}")
  getPosts(@Param("userId") userId: string) {
    return this.postService.findAll(userId);
  }

  @ApiResponse({
    status: 201,
    description: "post created successfully"
  })
  @ApiOperation({
    summary: "create a new post"
  })
  @Post()
  createPost(@Body() createPostDto: CreatePostDto) {
    return this.postService.create(createPostDto);
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
    return this.postService.update(patchPostDto.id);
  }
}
