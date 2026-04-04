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
import { PaginationModule } from "src/common/pagination/pagination.module";
import { JwtModule } from "@nestjs/jwt";
import jwtConfig from "./auth/config/jwt.config";
import { APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { AccessTokenGuard } from "./auth/guards/access-token-guards/access-token.guard";
import { AuthenticationGuard } from "./auth/guards/access-token-guards/authentication.guard";
import { DataResponseInterceptor } from "src/common/interceptors/data-response/data-response.interceptor";

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
    PaginationModule,
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
    MetaOptionsModule,
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig)
  ],

  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard
    },
    { provide: APP_INTERCEPTOR, useClass: DataResponseInterceptor },

    AccessTokenGuard
  ]
})
export class AppModule {}
