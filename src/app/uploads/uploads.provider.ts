import { Injectable, InternalServerErrorException, BadRequestException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { Express } from "express";
import * as path from "path";
import { randomUUID } from "crypto";

@Injectable()
export class UploadToCloudinaryProvider {
  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.getOrThrow<string>("CLOUDINARY_NAME"),
      api_key: this.configService.getOrThrow<string>("CLOUDINARY_API_KEY"),
      api_secret: this.configService.getOrThrow<string>("CLOUDINARY_API_SECRET")
    });
  }

  public async uploadFile(file: Express.Multer.File): Promise<{ url: string; public_id: string }> {
    // ✅ Validate file
    if (!file || !file.buffer) {
      throw new BadRequestException("Invalid file upload");
    }

    const fileName = this.generateFileName(file);

    try {
      const result = await new Promise<UploadApiResponse>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            public_id: fileName,
            folder: this.configService.get<string>("CLOUDINARY_FOLDER") || "uploads",
            resource_type: "auto"
          },
          (error, result) => {
            if (error) {
              return reject(
                new InternalServerErrorException(error.message || "Cloudinary upload failed")
              );
            }
            if (!result) {
              return reject(new InternalServerErrorException("No response from Cloudinary"));
            }
            resolve(result);
          }
        );

        uploadStream.end(file.buffer);
      });

      // ✅ Return only what you need
      return {
        url: result.secure_url,
        public_id: result.public_id
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message || "File upload failed");
    }
  }

  private generateFileName(file: Express.Multer.File): string {
    const base = path.parse(file.originalname).name.replace(/\s+/g, "").trim();

    const ext = path.extname(file.originalname);

    return `${base}-${Date.now()}-${randomUUID()}${ext}`;
  }
}
