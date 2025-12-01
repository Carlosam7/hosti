import { PrismaClient } from "@prisma/client";
import { DeployRepository } from "./repositories/deploy.repository.js";
import type { CreateDeployDto } from "../deploy/dto/create-deploy.dto.js";

export class SqliteDBService {
  private static instance: SqliteDBService;

  private prisma: PrismaClient;
  private deployRepository: DeployRepository;

  private constructor() {
    this.prisma = new PrismaClient();
    this.deployRepository = new DeployRepository(this.prisma);
  }

  static getInstance(): SqliteDBService {
    if (!this.instance) {
      this.instance = new SqliteDBService();
    }
    return this.instance;
  }

  async findDeployment(subdomain: string) {
    return this.deployRepository.findUnique(subdomain);
  }

  async findDeploymentByUserId(userId: string) {
    return this.deployRepository.findByUserId(userId);
  }

  async getAllDeployments() {
    return await this.deployRepository.getAllDeployments();
  }

  async getActiveDeployments() {
    return await this.deployRepository.getActiveDeployments();
  }

  async updateActiveStatus(subdomain: string, active: boolean) {
    return await this.deployRepository.updateActiveStatus(subdomain, active);
  }

  async saveDeploymentData(userId: string, dto: CreateDeployDto) {
    await this.deployRepository.create(userId, dto);
  }

  async deleteDeploymentData(subdomain: string) {
    await this.deployRepository.delete(subdomain);
  }

  async notifyAccess(subdomain: string) {
    await this.deployRepository.notifyAccess(subdomain);
  }
}
