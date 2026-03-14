import { BadRequestException, ConflictException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ActiveUserData } from "src/auth/interfaces/activeUserDataInterface";
import { CreatePostDto } from "src/post/dtos/create-post-dto";
import { Post } from "src/post/postEntity";
import { TagsService } from "src/tags/tags.service";
import { UserService } from "src/user/user.service";

@Injectable()
export class CreatePostProvider {
  constructor(
    private readonly usersService: UserService,
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
    private readonly tagsService: TagsService
  ) {}

  public async create(createPostDto: CreatePostDto, user: ActiveUserData) {
    try {
      const author = await this.usersService.findOneById(user.sub); // 👈 extract the actual User entity

      const tags = await this.tagsService.findMultipleTags(createPostDto.tags ?? []);

      if (createPostDto.tags && createPostDto.tags.length !== tags.length) {
        throw new BadRequestException("Please check your tag IDs");
      }

      const post = this.postsRepository.create({
        ...createPostDto,
        author, // now a valid User entity
        tags
      });

      return await this.postsRepository.save(post);
    } catch (error: any) {
      if (error instanceof BadRequestException) throw error;

      throw new ConflictException({
        message: "Failed to create post",
        error: error?.message ?? "Unknown error",
        description: "Ensure post slug is unique and not a duplicate"
      });
    }
  }
}
