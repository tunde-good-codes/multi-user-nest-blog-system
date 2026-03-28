import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserModule } from "./user/user.module";
import { PostModule } from "./post/post.module";
import { AuthModule } from "./auth/auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TagsModule } from "./tags/tags.module";
import { MetaOptionsModule } from "./meta-options/meta-options.module";
import appConfig from "src/config/app.config";
import databaseConfig from "src/config/database.config";
import environmentValidation from "src/config/environment.validation";

const env = process.env.NODE_ENV;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: !env ? ".env" : `.env.${env}`,
      load: [appConfig, databaseConfig],
      validationSchema: environmentValidation
    }), // 👈 load .env first and makes it available in all the modules

    UserModule,
    PostModule,
    AuthModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: "postgres",
        url: config.get<string>("DATABASE_URL"),
        autoLoadEntities: true,
        synchronize: true, // dev only
        ssl: {
          rejectUnauthorized: false
        }
      })
    }),
    TagsModule,
    MetaOptionsModule
  ],

  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
