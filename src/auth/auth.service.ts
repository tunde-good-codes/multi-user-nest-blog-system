import { Injectable } from "@nestjs/common";
import { SignInDto } from "./dtos/signInDto";
import { SignInProvider } from "./providers/signInProvider";
import { RefreshTokenProvider } from "./providers/refresh-token.provider/refresh-token.provider";
import { RefreshTokenDto } from "./dtos/refresh-token.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly signInProvider: SignInProvider,
    private readonly refreshTokenProvider: RefreshTokenProvider
  ) {}

  async signIn(signInDto: SignInDto) {
    return await this.signInProvider.signIn(signInDto);
  }

  async refreshTokens(refreshToken: RefreshTokenDto) {
    return await this.refreshTokenProvider.refreshTokens(refreshToken);
  }
}
