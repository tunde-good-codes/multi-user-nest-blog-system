import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { CreateAuthDto } from "./dto/create-auth.dto";
import { UserService } from "../user/providers/users.service";

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService
  ) {}
  create(createAuthDto: CreateAuthDto) {
    return "This action adds a new auth";
  }

  isAuth() {
    return false;
  }
}
