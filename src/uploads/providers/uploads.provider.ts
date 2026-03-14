import { Injectable, RequestTimeoutException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { Express } from "express";
import * as path from "path";
import { randomUUID } from "crypto";

@Injectable()
export class CloudinaryProvider {
  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: configService.get("CLOUDINARY_NAME"),
      api_key: configService.get("CLOUDINARY_API_KEY"),
      api_secret: configService.get("CLOUDINARY_API_SECRET")
    });
  }

  public async uploadFile(file: Express.Multer.File): Promise<UploadApiResponse> {
    try {
      const fileName = this.generateFileName(file);

      return new Promise<UploadApiResponse>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { public_id: fileName, folder: "nest-blog-app", resource_type: "auto" },
          (error, result) => {
            if (error) return reject(new Error(error.message || "Upload failed"));
            if (!result) return reject(new Error("No result from Cloudinary"));
            resolve(result);
          }
        );
        uploadStream.end(file.buffer);
      });
    } catch (error) {
      throw new RequestTimeoutException(error);
    }
  }

  private generateFileName(file: Express.Multer.File) {
    const base = path.parse(file.originalname).name.replace(/\s+/g, "").trim();
    const ext = path.extname(file.originalname);
    return `${base}-${Date.now()}-${randomUUID()}${ext}`;
  }
}
