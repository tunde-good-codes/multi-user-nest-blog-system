import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AuthService } from "src/app/auth/auth.service";
import { User } from "../entities/user.entity";
import { Repository } from "typeorm";
import { CreateUserDto } from "../dto/create-user.dto";

@Injectable()
export class UserService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    @InjectRepository(User) private userRepository: Repository<User>
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
  public findOneById(id: string) {
    const auth = this.authService.isAuth();

    return [
      {
        id: 123,
        firstName: "ola",
        lastName: "ola-ide",
        email: "ola.mail.com"
      },
      {
        id: 133,
        firstName: "fola",
        lastName: "olsa-ide",
        email: "w3.mail.com"
      }
    ];
  }
  findOne(id: number, page: number, limit: number) {
    return `this id: ${id} for ${page}  and ${limit}`;
  }

  findAll() {
    return "all users";
  }
}
