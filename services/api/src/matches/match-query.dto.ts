import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString, Max, Min } from "class-validator";

export class MatchQueryDto {
  @IsOptional() @IsString() city?: string;
  @IsOptional() @IsString() gender?: string;
  @IsOptional() @IsString() language?: string;
  @IsOptional() @Type(() => Number) @IsInt() @Min(18) ageMin?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(18) ageMax?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(50) limit = 20;
}
