import { GenerateTokenProvider } from "./../../../providers/generate-token-provider/generate-token-provider";
import { UserService } from "src/user/user.service";
import {
  forwardRef,
  Inject,
  Injectable,
  OnModuleInit,
  UnauthorizedException
} from "@nestjs/common";
import type { ConfigType } from "@nestjs/config";
import { OAuth2Client } from "google-auth-library";
import jwtConfig from "src/auth/config/jwt.config";
import { GoogleTokenDto } from "../../dtos/google-token-f=dto";

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
    try {
      const loginTicket = await this.oauthClient.verifyIdToken({
        idToken: googleTokenDto.token
      });

      const payload = loginTicket.getPayload() as GoogleTokenPayload;

      if (!payload || !payload.sub) {
        throw new UnauthorizedException("Invalid Google token payload");
      }

      const { email, sub: googleId, given_name: firstName, family_name: lastName } = payload;

      let user = await this.userService.findOneUserByGoogleId(googleId);
      if (user) {
        return this.generateTokenProvider.generateTokens(user);
      }

      user = await this.userService.createGoogleUser({
        email: email ?? "",
        firstName: firstName ?? "",
        lastName: lastName ?? "",
        googleId
      });

      return this.generateTokenProvider.generateTokens(user);
    } catch (e) {
      throw new UnauthorizedException(e);
    }
  }
}
