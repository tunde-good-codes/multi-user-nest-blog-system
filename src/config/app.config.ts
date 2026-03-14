import { registerAs } from "@nestjs/config";

export default registerAs("appConfig", () => ({
  environment: process.env.NODE_ENV || "production",
  apiVersion: process.env.API_VERSION,
  cloudinaryName: process.env.CLOUDINARY_NAME,
  cloudinary_API_KEY: process.env.CLOUDINARY_API_KEY,
  cloudinary_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  mailHost: process.env.MAIL_HOST,
  smtpUsername: process.env.SMTP_USERNAME,
  smtpPassword: process.env.SMTP_PASSWORD
}));
