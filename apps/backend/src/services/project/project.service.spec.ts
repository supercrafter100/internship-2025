import { Test, TestingModule } from '@nestjs/testing';
import { ProjectService } from './project.service';
import { MinioClientService } from '../../minio-client/minio-client.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('ProjectService', () => {
  let service: ProjectService;
  const mockPrismaService = {
    project: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };
  const mockMinioClientService = {
    uploadBase64Image: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: MinioClientService, useValue: mockMinioClientService },
      ],
    }).compile();

    service = module.get<ProjectService>(ProjectService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
