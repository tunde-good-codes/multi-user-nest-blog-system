/* eslint-disable no-unsafe-finally */
import { ConflictException, Injectable, RequestTimeoutException } from "@nestjs/common";
import { DataSource } from "typeorm";
import { User } from "../entities/user.entity";
import { CreateManyUsersDto } from "../dto/create-many-userss.dto";

@Injectable()
export class UsersCreateManyProvider {
  constructor(private readonly dataSource: DataSource) {}

  async createMany(createUserDto: CreateManyUsersDto) {
    const newUsers: User[] = [];
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const user of createUserDto.users) {
        const newUser = queryRunner.manager.create(User, user);
        const result = await queryRunner.manager.save(newUser);
        newUsers.push(result);
      }
      // if successful
      await queryRunner.commitTransaction();
    } catch (error: any) {
      // if not successful

      await queryRunner.rollbackTransaction();

      throw new ConflictException("could not complete the transaction", {
        description: String(error)
      });
      console.log(error.message);
    } finally {
      try {
        await queryRunner.release();
      } catch (e: any) {
        throw new RequestTimeoutException("can't release the transaction at the moment", {
          description: String(e)
        });
      }

      return newUsers;
    }
  }
}
