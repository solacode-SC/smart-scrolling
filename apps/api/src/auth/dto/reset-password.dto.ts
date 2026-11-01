import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length } from "class-validator";

export class ResetPasswordDto {
  @ApiProperty({ description: "Password reset token received via email/link" })
  @IsString()
  @IsNotEmpty()
  token!: string;

  @ApiProperty({
    example: "NewSecurePassword123!",
    minLength: 8,
    maxLength: 128,
  })
  @IsString()
  @Length(8, 128, { message: "Password must be between 8 and 128 characters" })
  password!: string;
}
