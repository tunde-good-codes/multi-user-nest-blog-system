import { Controller, Get, Param } from "@nestjs/common";
import { PostService } from "./post.service";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Post Section")
@Controller("post")
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get("{/:userId}")
  getPosts(@Param("userId") userId: string) {
    return this.postService.findAll(userId);
  }
}
