import { forwardRef, Module } from "@nestjs/common";

import { UserController } from "./user.controller";
import { UserService } from "./providers/users.service";
import { AuthModule } from "../auth/auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { ConfigModule } from "@nestjs/config";
import profileConfig from "./config/profile.config";

@Module({
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
  imports: [
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([User]),
    ConfigModule.forFeature(profileConfig)
  ]
})
export class UserModule {}
