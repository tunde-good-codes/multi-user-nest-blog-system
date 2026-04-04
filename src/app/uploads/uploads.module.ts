import { Module } from "@nestjs/common";
import { UploadsService } from "./uploads.service";
import { UploadsController } from "./uploads.controller";
import { UploadToCloudinaryProvider } from "./uploads.provider";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Upload } from "./upload.entity";

@Module({
  controllers: [UploadsController],
  providers: [UploadsService, UploadToCloudinaryProvider],
  exports: [UploadsService],
  imports: [TypeOrmModule.forFeature([Upload])]
})
export class UploadsModule {}
