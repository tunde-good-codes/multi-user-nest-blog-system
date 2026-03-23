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
    // cascading allows for smooth creations of relating entities
    // const metaOption = createPostDto.metaOptions
    //   ? this.metaOptionRepository.create(createPostDto.metaOptions)
    //   : null;

    // if (metaOption) {
    //   await await this.metaOptionRepository.save(metaOption);
    // }

    const newPost = this.postRepository.create(createPostDto);

    // if (metaOption) {
    //   newPost.metaOptions = metaOption;
    // }

    return await this.postRepository.save(newPost);
  }
  async findAll(userId: string) {
    const user = this.userService.findOneById(userId);
    const posts = await this.postRepository.find({
      relations: {
        metaOptions: true
      }
    });

    return { posts, message: "This action returns all post" };
  }
  update(userid: number) {
    return "updated";
  }

  async delete(id: number) {
    // try {
    //   // get the post you want to delete
    //   const post = await this.postRepository.findOneBy({ id });

    //   // delete the post

    //   await this.postRepository.delete(id);

    //   // delete metaOption related to the post

    //   if (post?.metaOptions?.id) {
    //     await this.metaOptionRepository.delete(post?.metaOptions?.id);
    //   }

    //   return {
    //     deleted: true,
    //     id,
    //     message: "post deleted successfully with id: " + id
    //   };
    // } catch (e) {
    //   console.log(e.message);
    // }

    // using metaOption to find post

    // const post = await this.postRepository.findOneBy({ id });

    // const postViaMetaOption = await this.metaOptionRepository.find({
    //   where: { id: post?.metaOptions?.id },
    //   relations: {
    //     post: true
    //   }
    // });

    // console.log(postViaMetaOption);
    // after cascade set to true on metaOption,  delete on post will auto delete on meta-option
    const post = await this.postRepository.delete(id);
    return {
      deleted: true,
      id,
      post
    };
  }
}
