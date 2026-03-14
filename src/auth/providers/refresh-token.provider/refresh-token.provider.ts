import { UserService } from "src/user/user.service";
import { forwardRef, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import type { ConfigType } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import jwtConfig from "src/auth/config/jwt.config";
import { GenerateTokenProvider } from "../generate-token-provider/generate-token-provider";
import { RefreshTokenDto } from "src/auth/dtos/refresh-token.dto";
import { ActiveUserData } from "src/auth/interfaces/activeUserDataInterface";

@Injectable()
export class RefreshTokenProvider {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly generateTokenProvider: GenerateTokenProvider
  ) {}

  async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    try {
      // Extract the token string
      const { refreshToken } = refreshTokenDto;

      // Verify and decode token
      const { sub } = await this.jwtService.verifyAsync<Pick<ActiveUserData, "sub">>(refreshToken, {
        secret: this.jwtConfiguration.secret, // use refresh token secret if you have one
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer
      });

      // Find user and generate new tokens
      const user = await this.userService.findOneById(sub);
      return await this.generateTokenProvider.generateTokens(user);
    } catch (e) {
      throw new UnauthorizedException("Invalid or expired refresh token");
    }
  }
}
