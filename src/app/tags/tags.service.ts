import { Injectable } from "@nestjs/common";
import { CreateTagDto } from "./dto/create-tag.dto";
import { UpdateTagDto } from "./dto/update-tag.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Tag } from "./entities/tag.entity";
import { In, Repository } from "typeorm";

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>
  ) {}
  async create(createTagDto: CreateTagDto) {
    const tag = this.tagRepository.create(createTagDto);
    await this.tagRepository.save(tag);
    return {
      success: true,
      message: "tag created successfully",
      tag
    };
  }

  async findMultipleTags(tags: number[]) {
    return await this.tagRepository.find({
      where: {
        id: In(tags)
      }
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} tag`;
  }

  update(id: number, updateTagDto: UpdateTagDto) {
    return `This action updates a #${id} tag`;
  }

  remove(id: number) {
    return `This action removes a #${id} tag`;
  }
}
