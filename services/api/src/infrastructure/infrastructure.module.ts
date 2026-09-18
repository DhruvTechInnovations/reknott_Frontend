import { Global, Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { QueueService } from "./queue.service";
import { RedisService } from "./redis.service";
import { StorageService } from "./storage.service";

@Global()
@Module({ providers: [PrismaService, RedisService, StorageService, QueueService], exports: [PrismaService, RedisService, StorageService, QueueService] })
export class InfrastructureModule {}
