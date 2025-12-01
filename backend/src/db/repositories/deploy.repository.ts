import { PrismaClient } from "@prisma/client";
import type { CreateDeployDto } from "../../deploy/dto/create-deploy.dto.js";

export class DeployRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findUnique(subdomain: string) {
    return this.prisma.deploy.findUnique({
      where: { subdomain },
    });
  }

  async findByUserId(userId: string) {
    return this.prisma.deploy.findMany({
      where: { userId },
    });
  }

  async getAllDeployments() {
    return this.prisma.deploy.findMany();
  }

  async getActiveDeployments() {
    return this.prisma.deploy.findMany({
      where: { active: true },
    });
  }

  async updateActiveStatus(subdomain: string, active: boolean) {
    return this.prisma.deploy.update({
      where: { subdomain },
      data: { active },
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
