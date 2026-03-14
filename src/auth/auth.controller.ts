import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignInDto } from "./dtos/signInDto";
import { AuthType } from "./enum/auth-type.enum";
import { Auth } from "./decorators/auth.decorators";
import { RefreshTokenDto } from "./dtos/refresh-token.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post("sign-in")
  @Auth(AuthType.None)
  @HttpCode(HttpStatus.OK)
  signIn(@Body() signDto: SignInDto) {
    return this.authService.signIn(signDto);
  }
  @Post("refreshToken")
  @Auth(AuthType.None)
  @HttpCode(HttpStatus.OK)
  refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshTokens(refreshTokenDto);
  }
}
