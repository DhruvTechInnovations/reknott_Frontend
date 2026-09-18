import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerModule } from "@nestjs/throttler";
import { HealthModule } from "./health/health.module";
import { InfrastructureModule } from "./infrastructure/infrastructure.module";
import { MatchesModule } from "./matches/matches.module";
import { ProfilesModule } from "./profiles/profiles.module";
import { PublicModule } from "./public/public.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 60 }]),
    InfrastructureModule,
    HealthModule,
    ProfilesModule,
    MatchesModule,
    PublicModule,
  ],
})
export class AppModule {}
