import { Injectable } from "@nestjs/common";
import { UserService } from "../user/providers/users.service";

@Injectable()
export class PostService {
  constructor(private readonly userService: UserService) {}

  findAll(userId: string) {
    const user = this.userService.findOneById(userId);
    console.log(userId);

    return { user, message: "This action returns all post" };
  }
}
