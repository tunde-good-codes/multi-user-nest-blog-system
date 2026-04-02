import { RefreshTokenProvider } from "./providers/refresh-token-provider";
import { Injectable } from "@nestjs/common";
import { CreateAuthDto } from "./dto/create-auth.dto";
import { SignInDto } from "./dto/sign-in.dto";
import { SignInProvider } from "./providers/sign-in-provider";
import { RefreshTokenDto } from "./dto/refresh-token.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly signInProvider: SignInProvider,
    private readonly refreshTokenProvider: RefreshTokenProvider
  ) {}
  create(createAuthDto: CreateAuthDto) {
    console.log(createAuthDto);

    return "This action adds a new auth: ";
  }

  isAuth() {
    return false;
  }

  async signIn(signinDto: SignInDto) {
    return this.signInProvider.signIn(signinDto);
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    return this.refreshTokenProvider.refreshTokens(refreshTokenDto);
  }
}
