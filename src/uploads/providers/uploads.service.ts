import { ConfigService } from "@nestjs/config";
import { BadRequestException, ConflictException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CloudinaryProvider } from "./uploads.provider";
import { Upload } from "../upload.entity";
import { UploadFile } from "../interface/upload-file.interface";
import { fileTypes } from "../enums/file.type.enum";

@Injectable()
export class UploadsService {
  constructor(
    private readonly cloudinaryProvider: CloudinaryProvider,
    private readonly configService: ConfigService,
    @InjectRepository(Upload)
    private uploadsRepository: Repository<Upload>
  ) {}

  public async uploadFile(file: Express.Multer.File) {
    if (!["image/gif", "image/jpeg", "image/jpg", "image/png"].includes(file.mimetype)) {
      throw new BadRequestException("MIME type not supported");
    }

    try {
      // Upload to Cloudinary
      const uploadResult = await this.cloudinaryProvider.uploadFile(file);

      const uploadFile: UploadFile = {
        name: uploadResult.public_id,
        path: uploadResult.secure_url,
        type: fileTypes.IMAGE,
        mime: file.mimetype,
        size: file.size
      };

      const upload = this.uploadsRepository.create(uploadFile);
      return await this.uploadsRepository.save(upload);
    } catch (error) {
      throw new ConflictException(error);
    }
  }
}
