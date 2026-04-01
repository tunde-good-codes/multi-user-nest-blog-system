/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/await-thenable */
import { CreatePostDto } from "./dto/create-post.dto";
import {
  BadRequestException,
  Body,
  Injectable,
  NotFoundException,
  RequestTimeoutException
} from "@nestjs/common";
import { UserService } from "../user/providers/users.service";
import { InjectRepository } from "@nestjs/typeorm";
import { MetaOption } from "../meta-options/entities/meta-option.entity";
import { Repository } from "typeorm";
import { Post } from "./entities/post.entity";
import { TagsService } from "../tags/tags.service";
import { Tag } from "../tags/entities/tag.entity";
import { UpdatePostDto } from "./dto/update-post.dto";
import { GetPostsDto } from "./dto/get-post.dto";
import { PaginationProvider } from "src/common/pagination/pagination.provider";
import { Paginated } from "src/common/pagination/interfaces/paginatedInterface";
import { CreatePostProvider } from "./providers/create-post-provider";
import type { ActiveUserData } from "../auth/interface/active-user-data-interface";

@Injectable()
export class PostService {
  constructor(
    private readonly userService: UserService,
    private readonly tagsService: TagsService,

    @InjectRepository(MetaOption)
    private readonly metaOptionRepository: Repository<MetaOption>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly paginationProvider: PaginationProvider,
    private readonly createPostProvider: CreatePostProvider
  ) {}

  async create(createPostDto: CreatePostDto, user: ActiveUserData) {
    return await this.createPostProvider.create(createPostDto, user);
  }
  async findAll(userId: number) {
    const author = await this.userService.findOneById(userId);
    const posts = await this.postRepository.findOneBy({
      author
    });

    return { posts, message: "This action returns all post" };
  }
  async findAllPosts(postQuery: GetPostsDto): Promise<Paginated<Post>> {
    const limit = postQuery.limit ?? 4;
    const page = postQuery.page ?? 1;

    const posts = await this.paginationProvider.paginateQuery(
      { limit: limit, page: page },
      this.postRepository
    );
    return posts;
  }
  async update(updatePostDto: UpdatePostDto) {
    let tags: Tag[] = [];
    let post: any;

    try {
      if (!tags || tags.length !== updatePostDto.tags?.length) {
        throw new BadRequestException("please ensure tag id are correct");
      }

      tags = await this.tagsService.findMultipleTags(updatePostDto.tags);
      post = await this.postRepository.findOneBy({ id: updatePostDto.id });

      if (!post) {
        throw new NotFoundException(`Post with ID ${updatePostDto.id} not found`);
      }

      post.title = updatePostDto.title ?? post?.title;
      post.content = updatePostDto.content ?? post?.content;
      post.status = updatePostDto.status ?? post?.status;
      post.postType = updatePostDto.postType ?? post?.postType;
      post.slug = updatePostDto.slug ?? post?.slug;
      post.featuredImageUrl = updatePostDto.featuredImageUrl ?? post?.featuredImageUrl;
      post.publishedOn = updatePostDto.publishedOn ?? post?.publishedOn;
      post.tags = tags;

      await this.postRepository.save(post);

      return {
        success: true,
        message: "updated successfully",
        post
      };
    } catch (e) {
      throw new RequestTimeoutException("unable to process your request at the moment", {
        description: "Error connecting to db: " + e.message
      });
    }
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
