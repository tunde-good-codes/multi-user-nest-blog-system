import {
  BadRequestException,
  Inject,
  Injectable,
  RequestTimeoutException,
  forwardRef
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../userEntity";
import { HashingProvider } from "src/auth/providers/hashingProvider";
import { CreateUserDto } from "../dtos/create.user.dto";

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
    let existingUser: User | null = null;

    try {
      // Check is user exists with same email
      existingUser = await this.usersRepository.findOne({
        where: { email: createUserDto.email }
      });
    } catch (error) {
      // Might save the details of the exception
      // Information which is sensitive
      throw new RequestTimeoutException(
        "Unable to process your request at the moment please try later: " + error.message,
        {
          description: "Error connecting to the database"
        }
      );
    }

    // Handle exception
    if (existingUser) {
      throw new BadRequestException("The user already exists, please check your email.");
    }

    // Create a new user
    let newUser = this.usersRepository.create({
      ...createUserDto,
      password: await this.hashingProvider.hashPassword(createUserDto.password)
    });

    try {
      newUser = await this.usersRepository.save(newUser);
    } catch (error) {
      throw new RequestTimeoutException(
        "Unable to process your request at the moment please try later: " + error.message,
        {
          description: "Error connecting to the the database"
        }
      );
    }

    return newUser;
  }
}
