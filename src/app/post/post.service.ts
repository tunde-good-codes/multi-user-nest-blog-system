/* eslint-disable @typescript-eslint/await-thenable */
import { CreatePostDto } from "./dto/create-post.dto";
import { Injectable } from "@nestjs/common";
import { UserService } from "../user/providers/users.service";
import { InjectRepository } from "@nestjs/typeorm";
import { MetaOption } from "../meta-options/entities/meta-option.entity";
import { Repository } from "typeorm";
import { Post } from "./entities/post.entity";

@Injectable()
export class PostService {
  constructor(
    private readonly userService: UserService,

    @InjectRepository(MetaOption)
    private readonly metaOptionRepository: Repository<MetaOption>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>
  ) {}

  async create(createPostDto: CreatePostDto) {
    const metaOption = createPostDto.metaOptions
      ? this.metaOptionRepository.create(createPostDto.metaOptions)
      : null;

    if (metaOption) {
      await await this.metaOptionRepository.save(metaOption);
    }

    const newPost = this.postRepository.create(createPostDto);

    if (metaOption) {
      newPost.metaOptions = metaOption;
    }

    return await this.postRepository.save(newPost);
  }
  findAll(userId: string) {
    const user = this.userService.findOneById(userId);
    console.log(userId);

    return { user, message: "This action returns all post" };
  }
  update(userid: number) {
    return "updated";
  }
}
