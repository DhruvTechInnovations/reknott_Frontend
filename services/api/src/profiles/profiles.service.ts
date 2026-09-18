import { Injectable } from "@nestjs/common";
import { PrismaService } from "../infrastructure/prisma.service";
import { UpsertProfileDto } from "./profile.dto";

@Injectable()
export class ProfilesService {
  constructor(private readonly prisma: PrismaService) {}

  async getMine(cognitoSubject: string) {
    const user = await this.prisma.user.findUnique({ where: { cognitoSubject } });
    if (!user) return null;
    return this.prisma.profile.findUnique({ where: { userId: user.id }, include: { preferences: true, photos: true, verifications: true } });
  }

  async upsert(cognitoSubject: string, dto: UpsertProfileDto) {
    const user = await this.prisma.user.upsert({ where: { cognitoSubject }, create: { cognitoSubject, email: dto.email, status: "ACTIVE" }, update: { email: dto.email } });
    const data = { ...dto, dateOfBirth: new Date(dto.dateOfBirth) };
    return this.prisma.profile.upsert({ where: { userId: user.id }, create: { userId: user.id, ...data }, update: data });
  }
}
