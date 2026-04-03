import { Body, Controller, Post } from "@nestjs/common";
import { Auth } from "../decorators/auth.decorators";
import { AuthType } from "../enum/auth.enum";
import { GoogleAuthenticationService } from "./providers/google-authentication.services";
import { GoogleTokenDto } from "./dto/google-token.dto";

@Auth(AuthType.None)
@Controller("google-authentication")
export class GoogleAuthenticationController {
  constructor(private readonly googleAuthenticationService: GoogleAuthenticationService) {}

  @Post()
  authenticate(@Body() googleTokenDto: GoogleTokenDto) {
    return this.googleAuthenticationService.authenticate(googleTokenDto);
  }
}
