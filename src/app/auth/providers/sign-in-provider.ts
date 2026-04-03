/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { GenerateTokenProvider } from "./generate-token-provider";
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
    private readonly hashingProvider: HashingProvider,

    private readonly generateTokenProvider: GenerateTokenProvider
  ) {}

  async signIn(signInDto: SignInDto) {
    try {
      const user = await this.userService.findUserByEmail(signInDto.email);

      if (!user) {
        throw new UnauthorizedException("Invalid Email or password!", {
          description: "check password or email again"
        });
      }
      let password;

      if (user?.password) {
        password = user.password;
      }
      const isPasswordCorrect = await this.hashingProvider.comparePassword(
        signInDto.password,
        password
      );

      if (!isPasswordCorrect) {
        throw new UnauthorizedException("Invalid Email or password!", {
          description: "check password or email again"
        });
      }
      const tokens = await this.generateTokenProvider.generateTokens(user);
      // const accessToken = await this.jwtService.signAsync(
      //   {
      //     sub: user.id,
      //     email: user.email
      //   } as ActiveUserData,
      //   {
      //     audience: this.jwtConfiguration.audience,
      //     issuer: this.jwtConfiguration.issuer,
      //     secret: this.jwtConfiguration.secret,
      //     expiresIn: this.jwtConfiguration.accessTokenTtl
      //   }
      // );
      return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        }
      };
    } catch (e) {
      throw new RequestTimeoutException("Internal Server Error", {
        description: "request timed out: " + e.message
      });
    }
  }
}
