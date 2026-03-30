/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AuthService } from "src/app/auth/auth.service";
import { User } from "../entities/user.entity";
import { Repository } from "typeorm";
import { CreateUserDto } from "../dto/create-user.dto";
import { ConfigService } from "@nestjs/config";
import { UsersCreateManyProvider } from "./users-create-many-providers";
import { CreateManyUsersDto } from "../dto/create-many-userss.dto";
import { CreateUserProvider } from "./create-user-provider";
import { FindOneUserByEmailProvider } from "./find-one-user-by-email";

@Injectable()
export class UserService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly configService: ConfigService,

    private readonly usersCreateManyProvider: UsersCreateManyProvider,
    private readonly createUserProvider: CreateUserProvider,
    private readonly findOneUserByEmailProvider: FindOneUserByEmailProvider
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    return await this.createUserProvider.createUser(createUserDto);
  }

  async createMany(createUserDto: CreateManyUsersDto) {
    return this.usersCreateManyProvider.createMany(createUserDto);
  }
  public async findOneById(id: number) {
    let user;
    try {
      user = await this.userRepository.findOneBy({
        id
      });

      if (!user) {
        throw new BadRequestException("user not found with this id: " + id);
      }
    } catch (e: any) {
      throw new RequestTimeoutException("unable to process your request at the moment", {
        description: "Error connecting to db: " + e.message
      });
    }
    return user;
  }
  findOne(id: number, page: number, limit: number) {
    return `this id: ${id} for ${page}  and ${limit}`;
  }

  async findAll() {
    const users = await this.userRepository.find();

    return {
      users,
      success: true
    };
  }
  async deleteById(userId: number) {
    const user = await this.userRepository.findOneBy({
      id: userId
    });

    return {
      user,
      success: true,
      message: `user with id: ${userId} deleted `
    };
  }
  async findUserByEmail(email: string) {
    const user = await this.findOneUserByEmailProvider.findUserByEmail(email);

    return {
      user,
      success: true,
      message: `user with email: ${email} found!`
    };
  }
}
