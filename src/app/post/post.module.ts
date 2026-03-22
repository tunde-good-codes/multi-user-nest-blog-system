import { Module } from "@nestjs/common";
import { PostService } from "./post.service";
import { PostController } from "./post.controller";
import { UserModule } from "../user/user.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Post } from "./entities/post.entity";
import { MetaOption } from "../meta-options/entities/meta-option.entity";

@Module({
  controllers: [PostController],
  providers: [PostService],
  imports: [UserModule, TypeOrmModule.forFeature([Post, MetaOption])]
})
export class PostModule {}
