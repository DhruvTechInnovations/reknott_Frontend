import { Body, Controller, Post } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { QueueService } from "../infrastructure/queue.service";
import { StoryRequestDto, SupportRequestDto } from "./public.dto";

@Controller()
export class PublicController {
  constructor(private readonly queue: QueueService) {}
  @Post("support") @Throttle({ default: { limit: 5, ttl: 60_000 } })
  async support(@Body() dto: SupportRequestDto) { await this.queue.sendJson("SUPPORT_QUEUE_URL", { ...dto, receivedAt: new Date().toISOString() }); return { accepted: true }; }
  @Post("stories") @Throttle({ default: { limit: 3, ttl: 60_000 } })
  async story(@Body() dto: StoryRequestDto) { await this.queue.sendJson("STORY_QUEUE_URL", { ...dto, receivedAt: new Date().toISOString() }); return { accepted: true }; }
}
