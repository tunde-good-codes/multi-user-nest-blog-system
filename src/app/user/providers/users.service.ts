import { Injectable } from "@nestjs/common";

@Injectable()
export class UserService {
  public findOneById(id: string) {
    return [
      {
        id: 123,
        firstName: "ola",
        lastName: "ola-ide",
        email: "ola.mail.com"
      }
    ];
  }
}
