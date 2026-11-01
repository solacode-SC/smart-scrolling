import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from "class-validator";

export class RegisterDto {
  @ApiProperty({ example: "user@example.com" })
  @IsEmail({}, { message: "Please provide a valid email address" })
  email!: string;

  @ApiProperty({ example: "Password123!", minLength: 8, maxLength: 128 })
  @IsString()
  @Length(8, 128, { message: "Password must be between 8 and 128 characters" })
  password!: string;

  @ApiProperty({ example: "John Doe", minLength: 2, maxLength: 100 })
  @IsString()
  @IsNotEmpty({ message: "Name is required" })
  @Length(2, 100)
  name!: string;
}
