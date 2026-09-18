import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../infrastructure/prisma.service";
import { MatchQueryDto } from "./match-query.dto";

@Injectable()
export class MatchesService {
  constructor(private readonly prisma: PrismaService) {}
  async find(cognitoSubject: string, query: MatchQueryDto) {
    const currentUser = await this.prisma.user.findUnique({ where: { cognitoSubject }, select: { id: true } });
    const today = new Date();
    const bornAfter = query.ageMax ? new Date(today.getFullYear() - query.ageMax - 1, today.getMonth(), today.getDate()) : undefined;
    const bornBefore = query.ageMin ? new Date(today.getFullYear() - query.ageMin, today.getMonth(), today.getDate()) : undefined;
    const where: Prisma.ProfileWhereInput = {
      userId: currentUser ? { not: currentUser.id } : undefined, status: "ACTIVE", visibility: { in: ["COMPATIBLE_ONLY", "DISCOVERABLE"] },
      city: query.city ? { equals: query.city, mode: "insensitive" } : undefined,
      gender: query.gender ? query.gender as Prisma.EnumGenderFilter : undefined,
      languages: query.language ? { has: query.language } : undefined,
      dateOfBirth: bornAfter || bornBefore ? { gte: bornAfter, lte: bornBefore } : undefined,
    };
    return this.prisma.profile.findMany({ where, take: query.limit, orderBy: { updatedAt: "desc" }, select: { id: true, displayName: true, dateOfBirth: true, gender: true, city: true, profession: true, bio: true, languages: true, photos: { where: { status: "APPROVED", visibility: "REGISTERED_MEMBERS" }, take: 1, select: { id: true } }, verifications: { where: { status: "VERIFIED" }, select: { type: true, reviewedAt: true } } } });
  }
}
