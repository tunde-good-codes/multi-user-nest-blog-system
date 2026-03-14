import { Body, Controller, Post } from "@nestjs/common";
import { MetaOptionsService } from "./meta-options.service";
import { CreatePostMetaOptionsDto } from "./dtos/create-post-meta-options.dto";

@Controller("meta-options")
export class MetaOptionsController {
  constructor(private readonly metaOptionService: MetaOptionsService) {}

  @Post()
  create(@Body() createMetaOptionDto: CreatePostMetaOptionsDto) {
    return this.metaOptionService.createMetaOption(createMetaOptionDto);
  }
}
