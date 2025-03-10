import { CreateProjectDto } from '@bsaffer/api/project/dto/create-project.dto';
import { UpdateProjectDto } from '@bsaffer/api/project/dto/update-project.dto';
import { Injectable } from '@nestjs/common';
import { MinioClientService } from 'src/minio-client/minio-client.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProjectService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly minioClient: MinioClientService,
  ) {}

  async create(createProjectDto: CreateProjectDto) {
    const image = await this.minioClient.uploadBase64Image(
      createProjectDto.base64Image,
    );

    return this.prismaService.project.create({
      data: {
        ...createProjectDto,
        imgKey: image,
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
