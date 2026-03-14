import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { MetaOption } from "./metaOptions.entity";
import { CreatePostMetaOptionsDto } from "./dtos/create-post-meta-options.dto";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class MetaOptionsService {
  constructor(
    @InjectRepository(MetaOption)
    private readonly metaOptionRepository: Repository<MetaOption>
  ) {}

  async createMetaOption(createMetaOptionDto: CreatePostMetaOptionsDto) {
    const metaOption = this.metaOptionRepository.create(createMetaOptionDto);

    return await this.metaOptionRepository.save(metaOption);
  }
}
