import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class VerifyEmailDto {
  @ApiProperty({ description: "Verification token sent via email" })
  @IsString()
  @IsNotEmpty()
  token!: string;
}
