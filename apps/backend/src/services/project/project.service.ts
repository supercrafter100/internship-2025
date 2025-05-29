import { CreateProjectDto } from '@bsaffer/api/project/dto/create-project.dto';
import { UpdateProjectDto } from '@bsaffer/api/project/dto/update-project.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { MinioClientService } from '../../minio-client/minio-client.service';
import { PrismaService } from '../../prisma/prisma.service';

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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { base64Image, ...createProjectDBData } = createProjectDto;

    return this.prismaService.project.create({
      data: {
        ...createProjectDBData,
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

  async findOwn(userId: number) {
    const ownProjects = await this.prismaService.project.findMany({
      where: {
        userId,
      },
    });

    const partOfProjects = await this.prismaService.projectUser
      .findMany({
        where: {
          userId: userId,
        },
        include: {
          project: true,
        },
      })
      .then((res) => res.map((proj) => proj.project));

    return [...ownProjects, ...partOfProjects];
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
    // Check if there are any devices associated with the project
    const devices = await this.prismaService.device.findMany({
      where: {
        projectId: id,
      },
    });

    if (devices.length > 0) {
      throw new BadRequestException(
        'Cannot delete project with associated devices',
      );
    }

    // Delete the project image from MinIO
    const project = await this.prismaService.project.findUnique({
      where: {
        id,
      },
      select: {
        imgKey: true,
      },
    });

    if (project && project.imgKey) {
      await this.minioClient.removeFile(project.imgKey);
    }

    // Delete the project from the database
    return this.prismaService.project.delete({
      where: {
        id,
      },
    });
  }
}
