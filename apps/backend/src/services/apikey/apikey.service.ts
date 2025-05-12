import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { randomBytes } from 'crypto';

@Injectable()
export class ApikeyService {
  constructor(private readonly prismaService: PrismaService) {}

  public getProjectKeys(projectId: number) {
    return this.prismaService.apiKey.findMany({
      where: {
        projectId,
      },
    });
  }

  public getApiKey(key: string) {
    return this.prismaService.apiKey.findUnique({
      where: {
        key,
      },
    });
  }

  public createApiKey(projectId: number, name: string) {
    return this.prismaService.apiKey.create({
      data: {
        projectId,
        name,
        key: this.generateKey(),
      },
    });
  }

  public deleteApiKey(keyId: number) {
    return this.prismaService.apiKey.delete({
      where: {
        id: keyId,
      },
    });
  }

  private generateKey() {
    return randomBytes(32).toString('hex').substring(0, 16);
  }
}
