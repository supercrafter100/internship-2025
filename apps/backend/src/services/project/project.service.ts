import { CreateProjectDto } from '@bsaffer/api/project/dto/create-project.dto';
import { UpdateProjectDto } from '@bsaffer/api/project/dto/update-project.dto';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProjectService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createProjectDto: CreateProjectDto) {
    return this.prismaService.project.create({
      data: {
        ...createProjectDto,
      },
    });
  }

  async findAll(showHidden: boolean) {
    return this.prismaService.project.findMany({
      where: {
        public: showHidden ? undefined : true,
      },
    });
  }

  async findOne(id: number) {
    return this.prismaService.project.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: number, updateProjectDto: UpdateProjectDto) {
    return this.prismaService.project.update({
      where: {
        id,
      },
      data: {
        ...updateProjectDto,
      },
    });
  }

  async remove(id: number) {
    return this.prismaService.project.delete({
      where: {
        id,
      },
    });
  }
}
