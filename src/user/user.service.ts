import { CreateGoogleUserProvider } from "./providers/create-google-user.provider/create-google-user.provider";
import { FindOneUserByEmailProvider } from "./providers/findOneUserByEmail";
import { Injectable, NotFoundException, RequestTimeoutException } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { User } from "./userEntity";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserDto } from "./dtos/create.user.dto";
import { ConfigService } from "@nestjs/config";
import { UsersCreateManyProvider } from "./provider/users-create-many.provider/users-create-many.provider";
import { CreateManyUsersDto } from "./dtos/create-many-users.dto";
import { CreateUserProvider } from "src/user/providers/createUserProvider";
import { FindOneByGoogleIdProvider } from "./providers/find-one-by-google-id.provider/find-one-by-google-id.provider";
import { GoogleUser } from "./interfaces/googleUserInterface";

/**
 * class to connect user table and perform it's logic
 */
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly dataSource: DataSource,
    private readonly userCreateManyProvider: UsersCreateManyProvider,
    private readonly createUserProvider: CreateUserProvider,
    private readonly findOneUserByEmailProvider: FindOneUserByEmailProvider,
    private readonly findOneByGoogleIdProvider: FindOneByGoogleIdProvider,
    private readonly createGoogleUserProvider: CreateGoogleUserProvider
  ) {}

  getAllUsers() {
    return [
      {
        id: 0,
        name: "ola"
      },
      {
        id: 2,
        name: "bola"
      },
      {
        id: 2,
        name: "kola"
      }
    ];
  }
  /** * find a single user by id */
  async findById(id: number) {
    const environment = this.configService?.get<string>("JWT_SECRET");
    console.log(environment);

    return await this.userRepository.findOneBy({ id });
  }

  async createUser(createUserDto: CreateUserDto) {
    return this.createUserProvider.createUser(createUserDto);
  }
  async findUserByEmail(email: string) {
    return this.findOneUserByEmailProvider.findUserByEmail(email);
  }
  async findOneById(id: number): Promise<User> {
    try {
      const user = await this.userRepository.findOneBy({ id });

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      return user;
    } catch (e) {
      throw new RequestTimeoutException(
        `Unable to process your request at the moment: ${e.message}`,
        { description: "Error connecting to database" }
      );
    }
  }

  async createManyUser(createUserDto: CreateManyUsersDto) {
    return await this.userCreateManyProvider.createManyUser(createUserDto);
  }

  async findOneUserByGoogleId(googleId: string) {
    return await this.findOneByGoogleIdProvider.findUserByGoogleId(googleId);
  }

  async createGoogleUser(googleUser: GoogleUser) {
    return await this.createGoogleUserProvider.createGoogleUser(googleUser);
  }
}
