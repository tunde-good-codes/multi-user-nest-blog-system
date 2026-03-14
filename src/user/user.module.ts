import { Module, forwardRef } from "@nestjs/common";

import { AuthModule } from "src/auth/auth.module";
import { ConfigModule } from "@nestjs/config";
import profileConfig from "./config/profile.config";
import { UserService } from "./user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./userEntity";
import { UserController } from "./user.controller";
import { UsersCreateManyProvider } from "./provider/users-create-many.provider/users-create-many.provider";
import { CreateUserProvider } from "./providers/createUserProvider";
import { FindOneUserByEmailProvider } from "./providers/findOneUserByEmail";
import { FindOneByGoogleIdProvider } from "./providers/find-one-by-google-id.provider/find-one-by-google-id.provider";
import { CreateGoogleUserProvider } from "./providers/create-google-user.provider/create-google-user.provider";

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    UsersCreateManyProvider,
    CreateUserProvider,
    FindOneUserByEmailProvider,
    FindOneByGoogleIdProvider,
    CreateGoogleUserProvider
  ],
  exports: [UserService],
  imports: [
    TypeOrmModule.forFeature([User]),
    ConfigModule.forFeature(profileConfig),
    forwardRef(() => AuthModule)
  ]
})
export class UserModule {}
