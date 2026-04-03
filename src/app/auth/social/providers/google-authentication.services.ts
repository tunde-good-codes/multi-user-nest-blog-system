/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import {
  forwardRef,
  Inject,
  Injectable,
  OnModuleInit,
  UnauthorizedException
} from "@nestjs/common";
import type { ConfigType } from "@nestjs/config";
import { OAuth2Client } from "google-auth-library";
import { UserService } from "src/app/user/providers/users.service";
import { GenerateTokenProvider } from "../../providers/generate-token-provider";
import jwtConfig from "../../config/jwt.config";
import { GoogleTokenDto } from "../dto/google-token.dto";

interface GoogleTokenPayload {
  email?: string;
  given_name?: string;
  family_name?: string;
  sub: string; // must exist
}

@Injectable()
export class GoogleAuthenticationService implements OnModuleInit {
  private oauthClient: OAuth2Client;

  constructor(
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly generateTokenProvider: GenerateTokenProvider
  ) {}

  onModuleInit() {
    const clientId = this.jwtConfiguration.googleClientId;
    const clientSecret = this.jwtConfiguration.googleClientSecret;
    this.oauthClient = new OAuth2Client(clientId, clientSecret);
  }

  async authenticate(googleTokenDto: GoogleTokenDto) {
    const loginToken = await this.oauthClient.verifyIdToken({
      idToken: googleTokenDto.token,
      audience: this.jwtConfiguration.googleClientId
    });

    const payload = loginToken.getPayload();

    if (!payload || !payload.sub) {
      throw new UnauthorizedException("Invalid Google token");
    }

    const { email, sub: googleId } = payload;

    const user = await this.userService.findOneByGoogleId(googleId);

    if (user) {
      return this.generateTokenProvider.generateTokens(user);
    }

    // create user here
  }
}
