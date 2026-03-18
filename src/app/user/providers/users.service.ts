import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { AuthService } from "src/app/auth/auth.service";

@Injectable()
export class UserService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService
  ) {}

  public findOneById(id: string) {
    const auth = this.authService.isAuth();
    console.log(auth);

    return [
      {
        id: 123,
        firstName: "ola",
        lastName: "ola-ide",
        email: "ola.mail.com"
      },
      {
        id: 133,
        firstName: "fola",
        lastName: "olsa-ide",
        email: "w3.mail.com"
      }
    ];
  }
  findOne(id: number) {
    return `this id: ${id}`;
  }
}
