import { forwardRef, Module } from "@nestjs/common";

import { UserController } from "./user.controller";
import { UserService } from "./providers/users.service";
import { AuthModule } from "../auth/auth.module";

@Module({
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
  imports: [forwardRef(() => AuthModule)]
})
export class UserModule {}
