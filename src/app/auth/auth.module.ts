import { SignInProvider } from "./providers/sign-in-provider";
import { forwardRef, Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UserModule } from "../user/user.module";
import { HashingProvider } from "./providers/hashing.provider";
import { BcryptProvider } from "./providers/bcrypt.provider";
import { ConfigModule } from "@nestjs/config";
import jwtConfig from "./config/jwt.config";
import { JwtModule } from "@nestjs/jwt";

@Module({
  controllers: [AuthController],
  providers: [AuthService, { provide: HashingProvider, useClass: BcryptProvider }, SignInProvider],
  imports: [
    forwardRef(() => UserModule),
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider())
  ],
  exports: [AuthService, HashingProvider]
})
export class AuthModule {}
