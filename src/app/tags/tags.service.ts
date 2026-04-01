import { Injectable } from "@nestjs/common";
import { CreateTagDto } from "./dto/create-tag.dto";
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
  async findTags() {
    const tags = await this.tagRepository.find();
    return {
      tags,
      total: tags.length
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} tag`;
  }

  async remove(id: number) {
    await this.tagRepository.delete(id);
    return { success: true, message: "tag deleted", id };
  }

  async softRemove(id: number) {
    await this.tagRepository.softDelete(id);
    return { success: true, message: "tag deleted", id };
  }
}
