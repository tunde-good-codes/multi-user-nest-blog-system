import { Injectable, UnauthorizedException } from "@nestjs/common";
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
    const user = await this.userRepository.findOneBy({ email });

    if (!user) {
      throw new UnauthorizedException("Invalid email or password");
    }

    return user;
  }
}
