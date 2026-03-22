import { Injectable } from "@nestjs/common";
import { UpdateMetaOptionDto } from "./dto/update-meta-option.dto";
import { Repository } from "typeorm";
import { MetaOption } from "./entities/meta-option.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CreatePostMetaOptionsDto } from "./dto/create-post-meta-options.dto";

@Injectable()
export class MetaOptionsService {
  constructor(
    @InjectRepository(MetaOption)
    private readonly metaOptionRepository: Repository<MetaOption>
  ) {}
  async create(createPostMetaOptionsDto: CreatePostMetaOptionsDto) {
    const metaOption = this.metaOptionRepository.create(createPostMetaOptionsDto);
    return await this.metaOptionRepository.save(metaOption);
  }

  findAll() {
    return `This action returns all metaOptions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} metaOption`;
  }

  update(id: number, updateMetaOptionDto: UpdateMetaOptionDto) {
    return `This action updates a #${id} metaOption`;
  }

  remove(id: number) {
    return `This action removes a #${id} metaOption`;
  }
}
