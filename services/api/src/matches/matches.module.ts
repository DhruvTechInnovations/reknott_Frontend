import { Module } from "@nestjs/common";
import { CognitoAuthGuard } from "../common/cognito-auth.guard";
import { MatchesController } from "./matches.controller";
import { MatchesService } from "./matches.service";

@Module({ controllers: [MatchesController], providers: [MatchesService, CognitoAuthGuard] })
export class MatchesModule {}
