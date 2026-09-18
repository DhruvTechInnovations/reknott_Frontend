import { Body, Controller, Get, Put, Req, UseGuards } from "@nestjs/common";
import { CognitoAuthGuard, type AuthenticatedRequest } from "../common/cognito-auth.guard";
import { UpsertProfileDto } from "./profile.dto";
import { ProfilesService } from "./profiles.service";

@Controller("profiles")
@UseGuards(CognitoAuthGuard)
export class ProfilesController {
  constructor(private readonly profiles: ProfilesService) {}
  @Get("me") getMine(@Req() request: AuthenticatedRequest) { return this.profiles.getMine(request.user.subject); }
  @Put("me") upsert(@Req() request: AuthenticatedRequest, @Body() dto: UpsertProfileDto) { return this.profiles.upsert(request.user.subject, dto); }
}
