import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { MetaOptionsService } from "./meta-options.service";
import { UpdateMetaOptionDto } from "./dto/update-meta-option.dto";
import { CreatePostMetaOptionsDto } from "./dto/create-post-meta-options.dto";

@Controller("meta-options")
export class MetaOptionsController {
  constructor(private readonly metaOptionsService: MetaOptionsService) {}

  @Post()
  create(@Body() createPostMetaOptionDto: CreatePostMetaOptionsDto) {
    return this.metaOptionsService.create(createPostMetaOptionDto);
  }

  @Get()
  findAll() {
    return this.metaOptionsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.metaOptionsService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateMetaOptionDto: UpdateMetaOptionDto) {
    return this.metaOptionsService.update(+id, updateMetaOptionDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.metaOptionsService.remove(+id);
  }
}
