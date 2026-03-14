import { Injectable, RequestTimeoutException, UnauthorizedException } from "@nestjs/common";
import { Repository } from "typeorm";
import { User } from "../userEntity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class FindOneUserByEmailProvider {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async findUserByEmail(email: string) {
    let user: User | null = null;
    try {
      user = await this.userRepository.findOneBy({ email });
      if (!user) {
        throw new UnauthorizedException("user with this email not fond");
      }
      return user;
    } catch (e) {
      throw new RequestTimeoutException(e, {
        description: "could not fetch this user"
      });
    }
  }
}
