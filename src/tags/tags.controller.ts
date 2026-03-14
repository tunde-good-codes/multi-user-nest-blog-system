import { Body, Controller, Delete, Param, ParseIntPipe, Post } from "@nestjs/common";
import { TagsService } from "./tags.service";
import { CreateTagDto } from "./dtos/create-tags.dto";

@Controller("tags")
export class TagsController {
  constructor(private readonly tagService: TagsService) {}

  @Post()
  create(@Body() createTagDto: CreateTagDto) {
    return this.tagService.createTag(createTagDto);
  }

  @Delete()
  deleteTag(@Param("id", ParseIntPipe) id: number) {
    return this.tagService.delete(id);
  }
}
