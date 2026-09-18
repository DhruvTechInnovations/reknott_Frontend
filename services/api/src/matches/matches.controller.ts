import { Controller, Get, Query, Req, UseGuards } from "@nestjs/common";
import { CognitoAuthGuard, type AuthenticatedRequest } from "../common/cognito-auth.guard";
import { MatchQueryDto } from "./match-query.dto";
import { MatchesService } from "./matches.service";

@Controller("matches")
@UseGuards(CognitoAuthGuard)
export class MatchesController {
  constructor(private readonly matches: MatchesService) {}
  @Get() find(@Req() request: AuthenticatedRequest, @Query() query: MatchQueryDto) { return this.matches.find(request.user.subject, query); }
}
