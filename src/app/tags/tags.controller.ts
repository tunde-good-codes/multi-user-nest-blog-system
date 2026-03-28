import { Controller, Get, Post, Body, Delete, ParseIntPipe, Query } from "@nestjs/common";
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
  @Get("/all")
  findTags() {
    return this.tagsService.findTags();
  }

  @Delete()
  delete(@Query("id", ParseIntPipe) id: number) {
    return this.tagsService.remove(id);
  }

  @Delete("/soft")
  softDelete(@Query("id", ParseIntPipe) id: number) {
    return this.tagsService.softRemove(id);
  }
}
