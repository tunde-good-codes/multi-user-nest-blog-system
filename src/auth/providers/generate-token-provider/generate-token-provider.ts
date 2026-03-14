import { Inject, Injectable } from "@nestjs/common";
import type { ConfigType } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import jwtConfig from "src/auth/config/jwt.config";
import { ActiveUserData } from "src/auth/interfaces/activeUserDataInterface";
import { User } from "src/user/userEntity";

@Injectable()
export class GenerateTokenProvider {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>
  ) {}

  async signInToken<T>(userId: number, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload
      } as ActiveUserData,
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn
      }
    );
  }

  async generateTokens(user: User) {
    const [accessToken, refreshToken] = await Promise.all([
      //access tokens
      this.signInToken<Partial<ActiveUserData>>(user.id, this.jwtConfiguration.accessTokenTtl, {
        email: user.email
      }),

      // refresh tokens

      this.signInToken(user.id, this.jwtConfiguration.refreshTokenTtl)
    ]);

    return { accessToken, refreshToken };
  }
}
