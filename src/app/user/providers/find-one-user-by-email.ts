import { Injectable, RequestTimeoutException, UnauthorizedException } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../entities/user.entity";

@Injectable()
export class FindOneUserByEmailProvider {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async findUserByEmail(email: string) {
    try {
      const user = await this.userRepository.findOneBy({ email });
      if (!user) {
        throw new UnauthorizedException("user with this email not fond");
      }
      return user;
    } catch (e) {
      throw new RequestTimeoutException(e, {
        description: "could not fetch this user with the provided email"
      });
    }
  }
}
