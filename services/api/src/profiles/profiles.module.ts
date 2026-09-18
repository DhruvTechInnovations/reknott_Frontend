import { Module } from "@nestjs/common";
import { CognitoAuthGuard } from "../common/cognito-auth.guard";
import { ProfilesController } from "./profiles.controller";
import { ProfilesService } from "./profiles.service";

@Module({ controllers: [ProfilesController], providers: [ProfilesService, CognitoAuthGuard] })
export class ProfilesModule {}
