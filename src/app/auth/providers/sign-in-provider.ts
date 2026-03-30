import {
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
  UnauthorizedException
} from "@nestjs/common";
import { UserService } from "src/app/user/providers/users.service";
import { HashingProvider } from "./hashing.provider";
import { SignInDto } from "../dto/sign-in.dto";

@Injectable()
export class SignInProvider {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly hashingProvider: HashingProvider
    // private readonly generateTokenProvider: GenerateTokenProvider
  ) {}

  async signIn(signInDto: SignInDto) {
    try {
      const user = await this.userService.findUserByEmail(signInDto.email);

      if (!user) {
        throw new UnauthorizedException("Invalid Email or password!", {
          description: "check password or email again"
        });
      }
      const isPasswordCorrect = await this.hashingProvider.comparePassword(
        signInDto.password,
        user.user.password
      );

      if (!isPasswordCorrect) {
        throw new UnauthorizedException("Invalid Email or password!", {
          description: "check password or email again"
        });
      }
      return {
        success: true,
        message: "sign in successfully"
      };
    } catch (e) {
      throw new RequestTimeoutException("Internal Server Error", {
        description: "request timed out: " + e.message
      });
    }
    // const { accessToken, refreshToken } = await this.generateTokenProvider.generateTokens(user);
    //   return { success: true, user, accessToken, refreshToken };
  }
}
