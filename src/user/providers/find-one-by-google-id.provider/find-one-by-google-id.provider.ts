import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/user/userEntity";
import { Repository } from "typeorm";

@Injectable()
export class FindOneByGoogleIdProvider {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async findUserByGoogleId(googleId: string) {
    return await this.userRepository.findOneBy({ googleId });
  }
}
