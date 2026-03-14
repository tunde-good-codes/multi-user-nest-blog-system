import { Auth } from "src/auth/decorators/auth.decorators";
import { GoogleTokenDto } from "../dtos/google-token-f=dto";
import { GoogleAuthenticationService } from "./../providers/google-authentication/google-authentication.service";
import { Body, Controller, Post } from "@nestjs/common";
import { AuthType } from "src/auth/enum/auth-type.enum";

@Auth(AuthType.None)
@Controller("google-authentication")
export class GoogleAuthenticationController {
  constructor(private readonly googleAuthenticationService: GoogleAuthenticationService) {}

  @Post()
  authenticate(@Body() googleTokenDto: GoogleTokenDto) {
    return this.googleAuthenticationService.authenticate(googleTokenDto);
  }
}
