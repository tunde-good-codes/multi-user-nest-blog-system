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

    if (!clientId || !clientSecret) {
      throw new Error("Google OAuth credentials are not configured");
    }

    this.oauthClient = new OAuth2Client(clientId, clientSecret);
  }

  async authenticate(googleTokenDto: GoogleTokenDto) {
    try {
      const loginToken = await this.oauthClient.verifyIdToken({
        idToken: googleTokenDto.token,
        audience: this.jwtConfiguration.googleClientId
      });

      const payload = loginToken.getPayload();

      if (!payload || !payload.sub) {
        throw new UnauthorizedException("Invalid Google token payload");
      }

      const { email, sub: googleId, given_name: firstName, family_name: lastName } = payload;

      // Validate required email
      if (!email) {
        throw new UnauthorizedException(
          "Email not provided by Google. Please ensure email permissions are granted."
        );
      }

      // Try to find existing user
      let user = await this.userService.findOneByGoogleId(googleId);

      // If user doesn't exist, create new one
      if (!user) {
        user = await this.userService.createGoogleUser({
          email, // email is guaranteed to exist here
          googleId,
          firstName: firstName || "", // Provide default if undefined
          lastName: lastName || "" // Provide default if undefined
        });
      }

      // Generate and return tokens for both existing and new users
      return this.generateTokenProvider.generateTokens(user);
    } catch (error) {
      // Handle specific errors
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      // Log the actual error for debugging (use your logger)
      // this.logger.error('Google authentication failed:', error);

      throw new UnauthorizedException("Google authentication failed. Please try again.");
    }
  }
}
