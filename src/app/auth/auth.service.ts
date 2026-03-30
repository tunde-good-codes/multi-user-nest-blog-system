import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { CreateAuthDto } from "./dto/create-auth.dto";
import { UserService } from "../user/providers/users.service";
import { SignInDto } from "./dto/sign-in.dto";
import { SignInProvider } from "./providers/sign-in-provider";

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly signInProvider: SignInProvider
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
}
