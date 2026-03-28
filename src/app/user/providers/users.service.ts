/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AuthService } from "src/app/auth/auth.service";
import { User } from "../entities/user.entity";
import { Repository } from "typeorm";
import { CreateUserDto } from "../dto/create-user.dto";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class UserService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly configService: ConfigService
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email }
    });

    if (existingUser) {
      throw new Error("already exisitng");
    }

    let newUser = this.userRepository.create(createUserDto);
    newUser = await this.userRepository.save(newUser);
    return newUser;
  }
  public async findOneById(id: number) {
    return this.userRepository.findOneBy({
      id
    });
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
