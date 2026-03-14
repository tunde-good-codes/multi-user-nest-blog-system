import { Module, forwardRef } from "@nestjs/common";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { HashingProvider } from "./providers/hashingProvider";
import { BcryptProvider } from "./providers/bryptProvider";
import { UserModule } from "src/user/user.module";
import { SignInProvider } from "./providers/signInProvider";
import { ConfigModule } from "@nestjs/config";
import jwtConfig from "./config/jwt.config";
import { JwtModule } from "@nestjs/jwt";
import { GenerateTokenProvider } from "./providers/generate-token-provider/generate-token-provider";
import { RefreshTokenProvider } from "./providers/refresh-token.provider/refresh-token.provider";
import { GoogleAuthenticationController } from "./social/google-authetication/google-authentication.controller";
import { GoogleAuthenticationService } from "./social/providers/google-authentication/google-authentication.service";

@Module({
  controllers: [AuthController, GoogleAuthenticationController],
  providers: [
    AuthService,
    SignInProvider,

    {
      provide: HashingProvider,
      useClass: BcryptProvider
    },

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
