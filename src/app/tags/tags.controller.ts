import { Controller, Get, Post, Body, Delete, Param, ParseIntPipe } from "@nestjs/common";
import { TagsService } from "./tags.service";
import { CreateTagDto } from "./dto/create-tag.dto";

@Controller("tags")
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  create(@Body() createTagDto: CreateTagDto) {
    return this.tagsService.create(createTagDto);
  }

  @Get()
  findMultiple() {
    return this.tagsService.findMultipleTags([3, 8]);
  }

  @Delete()
  delete(@Param("id", ParseIntPipe) id: number) {
    return this.tagsService.remove(id);
  }
}
