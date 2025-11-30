import { PrismaClient } from "@prisma/client";
import type { CreateDeployDto } from "../../deploy/dto/create-deploy.dto.js";

export class DeployRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findUnique(subdomain: string) {
    return this.prisma.deploy.findUnique({
      where: { subdomain },
    });
  }

  async create(userId: string, dto: CreateDeployDto) {
    return this.prisma.deploy.create({
      data: {
        userId,
        subdomain: dto.subdomain,
        repoUrl: dto.repoUrl,
        description: dto?.description || null,
      },
    });
  }

  async delete(subdomain: string) {
    return this.prisma.deploy.delete({
      where: { subdomain },
    });
  }

  async notifyAccess(subdomain: string) {
    return this.prisma.deploy.update({
      where: { subdomain },
      data: { lastAccess: new Date() },
    });
  }
}
