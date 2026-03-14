import { CreateManyUsersDto } from "./../../dtos/create-many-users.dto";
import { Injectable, RequestTimeoutException } from "@nestjs/common";
import { User } from "src/user/userEntity";
import { DataSource } from "typeorm";

@Injectable()
export class UsersCreateManyProvider {
  constructor(private readonly dataSource: DataSource) {}

  async createManyUser(createManyUsersDto: CreateManyUsersDto) {
    const newUsers: User[] = [];
    // create query runner instance

    const queryRunner = this.dataSource.createQueryRunner();

    // connect query runner to database

    await queryRunner.connect();
    // start transaction
    await queryRunner.startTransaction();
    try {
      for (const user of createManyUsersDto.users) {
        const newUser = queryRunner.manager.create(User, user);
        const result = await queryRunner.manager.save(newUser);
        newUsers.push(result);
      }
      //if successful commit

      await queryRunner.commitTransaction();
    } catch (e) {
      // if unsuccessful, rollback
      await queryRunner.rollbackTransaction();
      throw new RequestTimeoutException(`error : ${e.message}`);
    } finally {
      // either successful or not rollback

      await queryRunner.release();
    }
    return newUsers;
  }
}
