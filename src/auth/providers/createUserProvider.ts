import { MailService } from "./../../mail/providers/mail/mail.service";
import { BadRequestException, Inject, Injectable, RequestTimeoutException } from "@nestjs/common";
import { CreateUserDto } from "src/user/dtos/create.user.dto";
import { User } from "src/user/userEntity";
import { Repository } from "typeorm";
import { HashingProvider } from "./hashingProvider";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class CreateUserProvider {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(() => HashingProvider)
    private readonly hashingProvider: HashingProvider,
    private readonly mailService: MailService
  ) {}
  async createUser(createUserDto: CreateUserDto) {
    let existingUser: User | null = null; // or undefined
    try {
      existingUser = await this.userRepository.findOne({
        where: { email: createUserDto.email }
      });
    } catch (e) {
      throw new RequestTimeoutException(
        `this service
        unable to perform user creation: ${e.message}`,
        {
          description: "big server error"
        }
      );
    }
    if (existingUser) {
      throw new BadRequestException("this email already registered");
    }

    let newUser = this.userRepository.create({
      ...createUserDto,
      password: await this.hashingProvider.hashPassword(createUserDto.password)
    });
    try {
      newUser = await this.userRepository.save(newUser);
    } catch (e) {
      throw new RequestTimeoutException(`unable to perform user creation: ${e.message}`, {
        description: "big server error"
      });
    }
    try {
      const emailResponse = await this.mailService.sendUserWelcome(newUser);

      if (emailResponse.success) {
        console.log(`📧 Welcome email successfully sent to ${newUser.email}`);
      } else {
        console.warn(`⚠️ Failed to send email to ${newUser.email}: ${emailResponse.error}`);
      }
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e);
      throw new RequestTimeoutException(`Mail service error: ${message}`);
    }

    return newUser;
  }
}
