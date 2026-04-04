/* eslint-disable @typescript-eslint/no-unsafe-return */
import { ApiHeaders, ApiOperation } from "@nestjs/swagger";
import { Controller, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";

import type { Express } from "express";
import { Auth } from "../auth/decorators/auth.decorators";
import { AuthType } from "../auth/enum/auth.enum";
import { UploadsService } from "./uploads.service";

@Auth(AuthType.None)
@Controller("uploads")
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  // the field name is file so we put file here
  @UseInterceptors(FileInterceptor("file"))
  @ApiHeaders([
    { name: "Content-Type", description: "multipart/form-data" },
    { name: "Authorization", description: "Bearer Token" }
  ])
  @ApiOperation({ summary: "Upload a new image to the server" })
  @Post("file")
  public uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.uploadsService.uploadFile(file);
  }
}
