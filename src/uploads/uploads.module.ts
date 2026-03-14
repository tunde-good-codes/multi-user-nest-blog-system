import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Upload } from "./upload.entity";
import { CloudinaryProvider } from "./providers/uploads.provider";
import { UploadsController } from "./uploads.controller";
import { UploadsService } from "./providers/uploads.service";

@Module({
  controllers: [UploadsController],
  providers: [UploadsService, CloudinaryProvider],
  imports: [TypeOrmModule.forFeature([Upload])]
})
export class UploadsModule {}
