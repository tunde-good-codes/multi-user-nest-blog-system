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

@Injectable()
export class UserService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly configService: ConfigService,

    private readonly usersCreateManyProvider: UsersCreateManyProvider
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    let existingUser;
    try {
      existingUser = await this.userRepository.findOne({
        where: { email: createUserDto.email }
      });

      if (existingUser) {
        throw new BadRequestException("user already existing with this  Email");
      }

      let newUser = this.userRepository.create(createUserDto);
      newUser = await this.userRepository.save(newUser);
      return newUser;
    } catch (e: any) {
      throw new RequestTimeoutException("unable to process your request at the moment", {
        description: "Error connecting to db: " + e.message
      });
    }
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

  findAll() {
    const jwt_secret = this.configService.get<string>("JWT_SECRET");
    console.log(jwt_secret);

    return "all users";
  }
}
