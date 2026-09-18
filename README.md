# ReKnott Matrimony

ReKnott is organised as a production-oriented TypeScript platform while preserving the established website design and respectful brand message.

## Technology

- Next.js 16, React 19 and TypeScript for the website
- NestJS and TypeScript for the API
- PostgreSQL with Prisma for core data
- Redis for caching, throttling and transient state
- Amazon Cognito for authentication
- Private Amazon S3 for profile and verification media
- Amazon SQS for support, moderation, notifications and consent workflows
- AWS Mumbai (`ap-south-1`) as the recommended production region

## Project structure

```text
app/                 Next.js routes and metadata
components/          Shared React and interactive components
lib/                 Typed profile data and API client
public/assets/       Brand and website images
services/api/        NestJS API and Prisma schema
infra/               Local PostgreSQL and Redis environment
ARCHITECTURE.md      AWS deployment and security model
```

## Run the website

```bash
npm run install:ci
npm run dev
```

## Run the API locally

```bash
docker compose -f infra/docker-compose.yml up -d
cd services/api
cp .env.example .env
npm install
npm run prisma:generate
npm run prisma:migrate
npm run start:dev
```

Set `NEXT_PUBLIC_API_URL=http://localhost:4000` for the web application after the API is running. Authentication endpoints require a configured Cognito user pool and client.

## Production readiness

The web experience is deployable now. Real registration, authentication, member media, payments, messaging, verification and matchmaking require the AWS resources, provider accounts, moderation operations and legal/privacy controls described in `ARCHITECTURE.md`.
