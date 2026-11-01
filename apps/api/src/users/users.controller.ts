import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { UsersService } from "./users.service";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { UpdatePreferencesDto } from "./dto/update-preferences.dto";
import { SessionAuthGuard } from "../auth/guards/session-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";

@ApiTags("Users")
@ApiBearerAuth()
@UseGuards(SessionAuthGuard)
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("me")
  @ApiOperation({ summary: "Get current user profile and preferences" })
  @ApiResponse({ status: 200, description: "Profile retrieved" })
  async getProfile(@CurrentUser("id") userId: string) {
    const user = await this.usersService.getProfile(userId);
    return {
      success: true,
      data: user,
    };
  }

  @Patch("me")
  @ApiOperation({ summary: "Update current user profile" })
  async updateProfile(
    @CurrentUser("id") userId: string,
    @Body() dto: UpdateProfileDto,
  ) {
    const user = await this.usersService.updateProfile(userId, dto);
    return {
      success: true,
      data: user,
    };
  }

  @Patch("me/preferences")
  @ApiOperation({ summary: "Update user reading and interface preferences" })
  async updatePreferences(
    @CurrentUser("id") userId: string,
    @Body() dto: UpdatePreferencesDto,
  ) {
    const preference = await this.usersService.updatePreferences(userId, dto);
    return {
      success: true,
      data: preference,
    };
  }

  @Delete("me")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Delete current user account" })
  async deleteAccount(@CurrentUser("id") userId: string) {
    const result = await this.usersService.deleteAccount(userId);
    return {
      success: true,
      data: result,
    };
  }
}
