import { ConflictException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";
import { User } from "../entities/user.entity";
import { GoogleUser } from "../interface/google-user.interface";

@Injectable()
export class CreateGoogleUserProvider {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  public async createGoogleUser(googleUser: GoogleUser) {
    try {
      const user = this.userRepository.create(googleUser);
      return await this.userRepository.save(user);
    } catch (e) {
      throw new ConflictException(e, {
        description: "could not create a new user"
      });
    }
  }
}
