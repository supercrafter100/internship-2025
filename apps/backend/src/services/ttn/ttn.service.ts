import { CreateTtnCredDto } from '@bsaffer/api/ttncred/dto/create-ttncred.dto';
import { UpdateTtnCredDto } from '@bsaffer/api/ttncred/dto/update-ttncred.dto';

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TtnService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllTtnCredentialsFromProject(projectId: number) {
    return {
      ttnCredentials: await this.prismaService.ttnProvider.findMany({
        where: {
          projectId,
        },
      }),
    };
  }

  async addTtnCredentialsToProject(
    createTtncredDto: CreateTtnCredDto,
    userId: number,
  ) {
    return this.prismaService.ttnProvider.create({
      data: {
        ...createTtncredDto,
        createdByid: userId,
      },
    });
  }

  async removeTtnCredentialsFromProject(projectId: number, ttnId: number) {
    return this.prismaService.ttnProvider.delete({
      where: {
        id: ttnId,
        projectId,
      },
    });
  }

  async updateTtnCredentialsFromProject(
    projectId: number,
    ttnId: number,
    UpdateTtnCredDto: UpdateTtnCredDto,
  ) {
    return this.prismaService.ttnProvider.updateMany({
      where: {
        id: ttnId,
        projectId,
      },
      data: {
        ...UpdateTtnCredDto,
      },
    });
  }

  async getTtnProviders(projectId: number) {
    return this.prismaService.ttnProvider.findMany({
      where: {
        projectId,
      },
    });
  }
}
