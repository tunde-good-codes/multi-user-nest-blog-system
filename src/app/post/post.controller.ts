import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { PostService } from "./post.service";
import { ApiTags } from "@nestjs/swagger";
import { CreatePostDto } from "./dto/create-post.dto";

@ApiTags("Post Section")
@Controller("post")
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get("{/:userId}")
  getPosts(@Param("userId") userId: string) {
    return this.postService.findAll(userId);
  }

  @Post()
  createPost(@Body() createPostDto: CreatePostDto) {
    console.log(createPostDto);
  }
}
