import {
  BadRequestException,
  Inject,
  Injectable,
  RequestTimeoutException,
  forwardRef
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../entities/user.entity";
import { Repository } from "typeorm";
import { HashingProvider } from "src/app/auth/providers/hashing.provider";
import { CreateUserDto } from "../dto/create-user.dto";

@Injectable()
export class CreateUserProvider {
  constructor(
    /**
     * Injecting usersRepository
     */
    @InjectRepository(User)
    private usersRepository: Repository<User>,

    /**
     * Inject BCrypt Provider
     */
    @Inject(forwardRef(() => HashingProvider))
    private readonly hashingProvider: HashingProvider
  ) {}

  public async createUser(createUserDto: CreateUserDto) {
    try {
      const userExisting = await this.usersRepository.findOne({
        where: { email: createUserDto.email }
      });

      if (userExisting) {
        throw new BadRequestException("User for this email is already existing", {
          description: "email already existing"
        });
      }

      const hashedPassword = await this.hashingProvider.hashPassword(createUserDto.password);
      const newUser = this.usersRepository.create({
        ...createUserDto,
        password: hashedPassword
      });
      await this.usersRepository.save(newUser);

      return newUser;
    } catch (e) {
      throw new RequestTimeoutException("Internal server error", {
        description: "can't create a new user: " + e.message
      });
    }
  }
}
