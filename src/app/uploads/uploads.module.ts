import { Module } from "@nestjs/common";
import { UploadsService } from "./uploads.service";
import { UploadsController } from "./uploads.controller";
import { UploadToCloudinaryProvider } from "./uploads.provider";

@Module({
  controllers: [UploadsController],
  providers: [UploadsService, UploadToCloudinaryProvider],
  exports: [UploadsService]
})
export class UploadsModule {}
