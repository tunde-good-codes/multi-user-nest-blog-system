import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Post } from "./postEntity";
import { CreatePostDto } from "./dtos/create-post-dto";
import { UserService } from "src/user/user.service";
import { TagsService } from "src/tags/tags.service";
import { UpdatePostDto } from "./dtos/updatePostDto";
import { GetPostsDto } from "./dtos/get.posts.dto";
import { PaginationProvider } from "src/pagination/pagination";
import { Paginated } from "src/common/pagination/interfaces/paginatedInterface";
import { CreatePostProvider } from "./providers/create-post.provider/create-post.provider";
import { ActiveUserData } from "src/auth/interfaces/activeUserDataInterface";

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
    private readonly userService: UserService,
    private readonly tagsService: TagsService,

    private readonly paginationProvider: PaginationProvider,
    private readonly createPostProvider: CreatePostProvider
  ) {}

  /**
   * Method to create a new post
   */
  public async create(createPostDto: CreatePostDto, user: ActiveUserData) {
    // Await the user lookup

    return await this.createPostProvider.create(createPostDto, user);
  }

  async findAll(postQuery: GetPostsDto): Promise<Paginated<Post>> {
    const posts = await this.paginationProvider.paginateQuery(
      {
        limit: postQuery.limit,
        page: postQuery.page
      },
      this.postsRepository
    );
    return posts;
  }

  async update(patchPostDto: UpdatePostDto) {
    // Find the post with relations
    const post = await this.postsRepository.findOne({
      where: { id: patchPostDto.id },
      relations: ["tags"]
    });

    // Check if post exists
    if (!post) {
      throw new NotFoundException(`Post with id ${patchPostDto.id} not found`);
    }

    // Fetch tags if provided
    if (patchPostDto.tags?.length) {
      post.tags = await this.tagsService.findMultipleTags(patchPostDto.tags);
    }

    // Update fields using nullish coalescing
    post.title = patchPostDto.title ?? post.title;
    post.content = patchPostDto.content ?? post.content;
    post.status = patchPostDto.status ?? post.status;
    post.postType = patchPostDto.postType ?? post.postType;
    post.slug = patchPostDto.slug ?? post.slug;
    post.featuredImageUrl = patchPostDto.featuredImageUrl ?? post.featuredImageUrl;
    post.publishedOn = patchPostDto.publishedOn ?? post.publishedOn;

    // Save and return the updated post
    return await this.postsRepository.save(post);
  }

  async deletePost(id: number) {
    // const post = await this.postsRepository.findOne({
    //   where: { id },
    //   relations: { metaOptions: true }
    // });

    // if (!post) {
    //   throw new NotFoundException(`Post with id ${id} not found`);
    // }

    // await this.postsRepository.delete(id);

    await this.postsRepository.delete(id);

    return { deleted: true, id };
  }
}
