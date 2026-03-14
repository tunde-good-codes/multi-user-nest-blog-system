import { Module } from "@nestjs/common";
import { PostsService } from "./post.service";
import { PostController } from "./post.controller";
import { UserModule } from "src/user/user.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Post } from "./postEntity";
import { MetaOption } from "src/meta-options/metaOptions.entity";
import { TagsModule } from "src/tags/tags.module";
import { PaginationModule } from "src/pagination/pagination.module";
import { CreatePostProvider } from "./providers/create-post.provider/create-post.provider";

@Module({
  providers: [PostsService, CreatePostProvider],
  controllers: [PostController],
  imports: [UserModule, TagsModule, PaginationModule, TypeOrmModule.forFeature([Post, MetaOption])]
})
export class PostModule {}
