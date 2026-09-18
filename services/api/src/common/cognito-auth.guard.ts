import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CognitoJwtVerifier } from "aws-jwt-verify";
import type { Request } from "express";

export type AuthenticatedRequest = Request & { user: { subject: string; email?: string } };

@Injectable()
export class CognitoAuthGuard implements CanActivate {
  private readonly verifier;
  constructor(config: ConfigService) {
    this.verifier = CognitoJwtVerifier.create({
      userPoolId: config.getOrThrow<string>("COGNITO_USER_POOL_ID"),
      tokenUse: "access",
      clientId: config.getOrThrow<string>("COGNITO_CLIENT_ID"),
    });
  }
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = request.headers.authorization?.replace(/^Bearer\s+/i, "");
    if (!token) throw new UnauthorizedException("Bearer token required");
    try {
      const payload = await this.verifier.verify(token);
      request.user = { subject: payload.sub, email: typeof payload.email === "string" ? payload.email : undefined };
      return true;
    } catch {
      throw new UnauthorizedException("Invalid or expired access token");
    }
  }
}
