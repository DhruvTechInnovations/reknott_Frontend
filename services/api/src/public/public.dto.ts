import { IsEmail, IsIn, IsOptional, IsString, Length, MaxLength } from "class-validator";

export class SupportRequestDto {
  @IsString() @Length(2, 80) name: string;
  @IsString() @Length(5, 120) contact: string;
  @IsOptional() @IsString() @MaxLength(30) profileId?: string;
  @IsString() @MaxLength(80) category: string;
  @IsString() @MaxLength(80) priority: string;
  @IsString() @Length(10, 4000) message: string;
}

export class StoryRequestDto {
  @IsString() @Length(2, 80) name: string;
  @IsEmail() email: string;
  @IsString() @IsIn(["Contact me before deciding", "Use initials only", "Keep the story anonymous", "Open to using names and photographs"]) privacy: string;
  @IsString() @Length(10, 4000) message: string;
}
