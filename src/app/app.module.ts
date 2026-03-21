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
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // 👈 load .env first

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
