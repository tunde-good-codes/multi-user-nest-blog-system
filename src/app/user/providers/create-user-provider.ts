/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { BadRequestException, Inject, Injectable, forwardRef } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../entities/user.entity";
import { Repository } from "typeorm";
import { HashingProvider } from "src/app/auth/providers/hashing.provider";
import { CreateUserDto } from "../dto/create-user.dto";
import { EmailService } from "src/app/email/email.service";
import { DataSource } from "typeorm";

@Injectable()
export class CreateUserProvider {
  constructor(
    /**
     * Injecting usersRepository
     */
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly dataSource: DataSource,

    /**
     * Inject BCrypt Provider
     */
    @Inject(forwardRef(() => HashingProvider))
    private readonly hashingProvider: HashingProvider,
    private readonly emailService: EmailService
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const userExisting = await queryRunner.manager.findOne(User, {
        where: { email: createUserDto.email }
      });

      if (userExisting) {
        throw new BadRequestException("User already exists");
      }

      const hashedPassword = await this.hashingProvider.hashPassword(createUserDto.password);

      const newUser = queryRunner.manager.create(User, {
        ...createUserDto,
        password: hashedPassword
      });

      await queryRunner.manager.save(newUser);

      // 🔥 If this fails → rollback happens
      await this.emailService.sendUserWelcome(newUser);

      await queryRunner.commitTransaction();

      return newUser;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }
}
