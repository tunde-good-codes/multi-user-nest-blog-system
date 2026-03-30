import { forwardRef, Module } from "@nestjs/common";

import { UserController } from "./user.controller";
import { UserService } from "./providers/users.service";
import { AuthModule } from "../auth/auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { ConfigModule } from "@nestjs/config";
import profileConfig from "./config/profile.config";
import { UsersCreateManyProvider } from "./providers/users-create-many-providers";
import { CreateUserProvider } from "./providers/create-user-provider";
import { FindOneUserByEmailProvider } from "./providers/find-one-user-by-email";

@Module({
  controllers: [UserController],
  providers: [UserService, UsersCreateManyProvider, CreateUserProvider, FindOneUserByEmailProvider],
  exports: [UserService],
  imports: [
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([User]),
    ConfigModule.forFeature(profileConfig)
  ]
})
export class UserModule {}
