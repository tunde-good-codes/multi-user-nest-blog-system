/* eslint-disable prettier/prettier */
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
import { JwtService } from "@nestjs/jwt";
import type { ConfigType } from "@nestjs/config";
import jwtConfig from "../config/jwt.config";

@Injectable()
export class SignInProvider {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly hashingProvider: HashingProvider,

    private readonly jwtService: JwtService,

    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>
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

      const accessToken = await this.jwtService.signAsync(
        {
          sub: user.user.id,
          email: user.user.email
        },
        {
          audience: this.jwtConfiguration.audience,
          issuer: this.jwtConfiguration.issuer,
          secret: this.jwtConfiguration.secret,
          expiresIn: this.jwtConfiguration.accessTokenTtl
        }
      );
      return {
        success: true,
        message: "sign in successfully",
        accessToken,
        user
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
