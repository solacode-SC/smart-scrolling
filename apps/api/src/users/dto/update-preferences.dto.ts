import { ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsBoolean,
  IsEnum,
  IsIn,
  IsInt,
  IsOptional,
  Max,
  Min,
} from "class-validator";

export class UpdatePreferencesDto {
  @ApiPropertyOptional({ enum: ["light", "dark", "system"] })
  @IsOptional()
  @IsIn(["light", "dark", "system"])
  theme?: string;

  @ApiPropertyOptional({ enum: ["Geist", "Inter", "Roboto", "System"] })
  @IsOptional()
  @IsIn(["Geist", "Inter", "Roboto", "System"])
  font?: string;

  @ApiPropertyOptional({ enum: ["S", "M", "L"] })
  @IsOptional()
  @IsIn(["S", "M", "L"])
  fontSize?: string;

  @ApiPropertyOptional({ enum: ["compact", "comfortable", "spacious"] })
  @IsOptional()
  @IsIn(["compact", "comfortable", "spacious"])
  feedDensity?: string;

  @ApiPropertyOptional({ enum: ["minimal", "standard"] })
  @IsOptional()
  @IsIn(["minimal", "standard"])
  cardStyle?: string;

  @ApiPropertyOptional({ enum: ["narrow", "standard", "wide"] })
  @IsOptional()
  @IsIn(["narrow", "standard", "wide"])
  contentWidth?: string;

  @ApiPropertyOptional({ enum: ["newest", "oldest"] })
  @IsOptional()
  @IsIn(["newest", "oldest"])
  defaultSort?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  autoplay?: boolean;

  @ApiPropertyOptional({ enum: ["click-to-load", "load-when-visible"] })
  @IsOptional()
  @IsIn(["click-to-load", "load-when-visible"])
  embedLoading?: string;

  @ApiPropertyOptional({ enum: ["expanded", "collapsed"] })
  @IsOptional()
  @IsIn(["expanded", "collapsed"])
  sidebarState?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  syncEnabled?: boolean;

  @ApiPropertyOptional({ minimum: 5, maximum: 1440 })
  @IsOptional()
  @IsInt()
  @Min(5)
  @Max(1440)
  syncIntervalMinutes?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  notificationsEnabled?: boolean;
}
