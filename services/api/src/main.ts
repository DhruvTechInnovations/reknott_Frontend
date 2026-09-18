import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import helmet from "helmet";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const config = app.get(ConfigService);
  app.setGlobalPrefix("v1");
  app.use(helmet({ crossOriginResourcePolicy: { policy: "same-site" } }));
  app.enableCors({ origin: config.getOrThrow<string>("WEB_ORIGIN").split(","), credentials: true });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
  await app.listen(config.get<number>("PORT", 4000), "0.0.0.0");
}

void bootstrap();
