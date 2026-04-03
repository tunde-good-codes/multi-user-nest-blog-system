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
import { GenerateTokenProvider } from "./providers/generate-token-provider";
import { RefreshTokenProvider } from "./providers/refresh-token-provider";
import { GoogleAuthenticationService } from "./social/providers/google-authentication.services";
import { GoogleAuthenticationController } from "./social/google-authentication.controller";

@Module({
  controllers: [AuthController, GoogleAuthenticationController],
  providers: [
    AuthService,
    { provide: HashingProvider, useClass: BcryptProvider },
    SignInProvider,
    GenerateTokenProvider,
    RefreshTokenProvider,
    GoogleAuthenticationService
  ],
  imports: [
    forwardRef(() => UserModule),
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider())
  ],
  exports: [AuthService, HashingProvider]
})
export class AuthModule {}
