# ReKnott production architecture

## Runtime boundaries

- `app/` and `components/`: Next.js 16 and React 19 web experience.
- `services/api/`: NestJS API designed for ECS Fargate or App Runner in AWS Mumbai.
- `services/api/prisma/`: PostgreSQL schema for accounts, profiles, preferences, verification, interests, messaging, memberships, reports and audit logs.
- `public/assets/`: brand and demonstration media served by the web application.
- `infra/docker-compose.yml`: local PostgreSQL and Redis services.

## Recommended AWS deployment

1. Route 53 and CloudFront terminate the public web domain; AWS WAF filters abusive traffic.
2. The Next.js web application serves the public experience and calls the API through an HTTPS origin.
3. An Application Load Balancer routes API traffic to NestJS containers on ECS Fargate.
4. Amazon Cognito issues access tokens. The API validates them with `CognitoAuthGuard`.
5. Aurora PostgreSQL stores relational data; ElastiCache Redis handles throttling, short-lived cache data and coordination.
6. Private S3 buckets hold photographs and verification material. Access must use short-lived signed URLs and KMS encryption.
7. SQS decouples moderation, notifications, support and story-consent workflows.
8. CloudWatch, OpenTelemetry and Sentry capture logs, traces and application errors.

## Security model

- Keep public profile fields separate from confidential identity and verification data.
- Never expose S3 object keys or make member media public.
- Remove image metadata, scan uploads, verify content types and create moderated derivatives.
- Record administrative access and changes in `AuditLog`.
- Require explicit consent for photograph access and contact-detail disclosure.
- Rate-limit OTP, login, interest, message and support endpoints.
- Store secrets in AWS Secrets Manager and rotate them; never commit `.env` files.
- Obtain qualified privacy, security and Indian matrimonial-law review before production launch.
