import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { Tag } from "./tag.entity";
import { CreateTagDto } from "./dtos/create-tags.dto";

@Injectable()
export class TagsService {
  constructor(@InjectRepository(Tag) private readonly tagRepository: Repository<Tag>) {}

  async createTag(createTagDto: CreateTagDto) {
    const tag = this.tagRepository.create(createTagDto);

    return await this.tagRepository.save(tag);
  }

  async findMultipleTags(tags: number[]) {
    const result = await this.tagRepository.find({
      where: { id: In(tags) }
    });

    return result;
  }

  async delete(id: number) {
    await this.tagRepository.delete(id);
    return {
      deleted: true,
      id
    };
  }

  async remove(id: number) {
    await this.tagRepository.softDelete(id);
    return {
      deleted: true,
      id
    };
  }
}
