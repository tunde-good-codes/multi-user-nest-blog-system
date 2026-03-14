import { Injectable } from "@nestjs/common";
import { HashingProvider } from "./hashingProvider";
import * as bcrypt from "bcrypt";
@Injectable()
export class BcryptProvider implements HashingProvider {
  async hashPassword(data: string | Buffer): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data, salt);
    return hashedPassword;
    throw new Error("not implemented");
  }
  comparePassword(data: string | Buffer, encrypted: string): Promise<boolean> {
    return bcrypt.compare(data, encrypted);
  }
}
