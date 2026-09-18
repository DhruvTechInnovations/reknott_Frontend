import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import { Injectable, ServiceUnavailableException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class QueueService {
  private readonly sqs: SQSClient;
  constructor(private readonly config: ConfigService) {
    this.sqs = new SQSClient({ region: config.get("AWS_REGION", "ap-south-1") });
  }
  async sendJson(queueKey: "SUPPORT_QUEUE_URL" | "STORY_QUEUE_URL", payload: unknown) {
    const queueUrl = this.config.get<string>(queueKey);
    if (!queueUrl) throw new ServiceUnavailableException(`${queueKey} is not configured`);
    await this.sqs.send(new SendMessageCommand({ QueueUrl: queueUrl, MessageBody: JSON.stringify(payload) }));
  }
}
