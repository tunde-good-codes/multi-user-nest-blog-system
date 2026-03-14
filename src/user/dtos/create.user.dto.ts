import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: "first name must have more than 3 characters" })
  @MaxLength(96, { message: "first name must have less than 96 characters" })
  firstName: string;
  @IsString()
  @IsOptional()
  @MinLength(3, { message: "last name must have more than 3 characters" })
  @MaxLength(96, { message: "last name must have less than 3 characters" })
  lastName?: string;
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: "password must have more than 8 characters" })
  @MaxLength(200, { message: "password must have more than 200 characters" })
  password: string;
}
