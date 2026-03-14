import { UserService } from "src/user/user.service";
import {
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
  UnauthorizedException
} from "@nestjs/common";
import { HashingProvider } from "./hashingProvider";
import { SignInDto } from "../dtos/signInDto";
import { GenerateTokenProvider } from "./generate-token-provider/generate-token-provider";

@Injectable()
export class SignInProvider {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly hashingProvider: HashingProvider,
    private readonly generateTokenProvider: GenerateTokenProvider
  ) {}

  async signIn(signInDto: SignInDto) {
    const user = await this.userService.findUserByEmail(signInDto.email);

    if (!user || !user.password) {
      throw new UnauthorizedException("Invalid email or password");
    }

    let isEqual = false;

    try {
      isEqual = await this.hashingProvider.comparePassword(signInDto.password, user.password);
    } catch (e) {
      throw new RequestTimeoutException(e, {
        description: "bad server error"
      });
    }

    if (!isEqual) {
      throw new UnauthorizedException("Incorrect password");
    }

    const { accessToken, refreshToken } = await this.generateTokenProvider.generateTokens(user);

    return { success: true, user, accessToken, refreshToken };
  }
}
