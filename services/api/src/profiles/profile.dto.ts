import { IsDateString, IsEmail, IsIn, IsOptional, IsString, Length, MaxLength } from "class-validator";

export class UpsertProfileDto {
  @IsString() @Length(2, 80) displayName: string;
  @IsDateString() dateOfBirth: string;
  @IsString() @IsIn(["WOMAN", "MAN", "ANOTHER_IDENTITY"]) gender: "WOMAN" | "MAN" | "ANOTHER_IDENTITY";
  @IsString() @Length(2, 100) city: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() @MaxLength(100) profession?: string;
  @IsOptional() @IsString() @MaxLength(100) education?: string;
  @IsOptional() @IsString() @MaxLength(2500) bio?: string;
  @IsOptional() @IsString() @MaxLength(2500) familyContext?: string;
  @IsOptional() @IsString() @MaxLength(2500) partnerIntent?: string;
}
