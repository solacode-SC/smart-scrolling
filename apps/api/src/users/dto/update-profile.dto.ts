import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, Length, IsUrl } from "class-validator";

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: "Jane Doe" })
  @IsOptional()
  @IsString()
  @Length(2, 100)
  name?: string;

  @ApiPropertyOptional({ example: "https://example.com/avatar.jpg" })
  @IsOptional()
  @IsUrl({}, { message: "Avatar must be a valid URL" })
  avatarUrl?: string;
}
