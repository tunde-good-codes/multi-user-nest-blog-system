import { registerAs } from "@nestjs/config";

export default registerAs("databaseConfig", () => ({
  database: {
    DATABASE_URL: process.env.DATABASE_URL,
    synchronize: process.env.DATABASE_SYNC === "true" ? true : false,
    autoLoadEntities: process.env.DATABASE_AUTOLOAD === "true" ? true : false
  },
  apiVersion: process.env.API_VERSION
}));
