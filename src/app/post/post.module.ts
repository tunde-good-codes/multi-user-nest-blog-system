import { Module } from "@nestjs/common";
import { PostService } from "./post.service";
import { PostController } from "./post.controller";
import { UserModule } from "../user/user.module";

@Module({
  controllers: [PostController],
  providers: [PostService],
  imports: [UserModule]
})
export class PostModule {}
