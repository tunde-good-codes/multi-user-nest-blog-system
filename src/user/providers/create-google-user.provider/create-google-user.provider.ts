import { ConflictException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GoogleUser } from "src/user/interfaces/googleUserInterface";
import { User } from "src/user/userEntity";
import { Repository } from "typeorm";

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
