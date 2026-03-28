import { registerAs } from "@nestjs/config";

export default registerAs("appConfig", () => ({
  environment: process.env.NODE_ENV || "production",
  cloudinary: {
    cloudinaryName: process.env.CLOUDINARY_NAME,
    cloudinary_API_KEY: process.env.CLOUDINARY_API_KEY,
    cloudinary_API_SECRET: process.env.CLOUDINARY_API_SECRET
  },
  email: {
    mailHost: process.env.MAIL_HOST,
    smtpUsername: process.env.SMTP_USERNAME,
    smtpPassword: process.env.SMTP_PASSWORD
  },
  database: {
    DATABASE_URL: process.env.DATABASE_URL,
    synchronize: process.env.DATABASE_SYNC === "true" ? true : false,
    autoLoadEntities: process.env.DATABASE_AUTOLOAD === "true" ? true : false
  },
  apiVersion: process.env.API_VERSION
}));
