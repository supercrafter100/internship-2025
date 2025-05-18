import { Test, TestingModule } from '@nestjs/testing';
import { ProjectService } from './project.service';
import { MinioClientService } from '../../minio-client/minio-client.service';
import { PrismaService } from '../../prisma/prisma.service';
import { title } from 'process';
import { CreateProjectDto } from '@bsaffer/api/project/dto/create-project.dto';
import { create } from 'domain';
import { console } from 'inspector';

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

  //BACKEND TESTS 01_1
  //Unit test die de service waarmee een project wordt aangemaakt in de backend zal verifiëren
  it('should create a project', async () => {
    // Demo project
    const demoProject: CreateProjectDto = {
      title: 'Test Project',
      shortDescription: 'Test Description',
      base64Image: 'base64ImageString',
      userId: 0,
      public: false,
    };

    // Mocked created project
    const expectedReturnProject = {
      id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      imgKey: 'base64Image',
      ...demoProject,
    };

    const { base64Image, ...rest } = demoProject;
    const expectedPrismaCall = { ...rest, imgKey: 'base64Image' };

    mockPrismaService.project.create.mockResolvedValue(expectedReturnProject);
    mockMinioClientService.uploadBase64Image.mockResolvedValue('base64Image');

    const result = await service.create(demoProject);
    expect(result).toEqual(expectedReturnProject);
    expect(mockPrismaService.project.create).toHaveBeenCalledWith({
      data: expectedPrismaCall,
    });
    expect(mockMinioClientService.uploadBase64Image).toHaveBeenCalledWith(
      demoProject.base64Image,
    );
  });

  it('should find all projects', async () => {
    const expectedProjects = [
      {
        title: 'Test Project 1',
        shortDescription: 'Test Description 1',
        userId: 0,
        public: false,
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        imgKey: 'base64Image1',
      },
      {
        title: 'Test Project 2',
        shortDescription: 'Test Description 2',
        userId: 0,
        public: false,
        id: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
        imgKey: 'base64Image2',
      },
    ];

    const mockPrismaResult = [
      {
        title: 'Test Project 1',
        shortDescription: 'Test Description 1',
        userId: 0,
        public: false,
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        imgKey: 'base64Image1',
      },
      {
        title: 'Test Project 2',
        shortDescription: 'Test Description 2',
        userId: 0,
        public: false,
        id: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
        imgKey: 'base64Image2',
      },
    ];

    mockPrismaService.project.findMany.mockResolvedValue(mockPrismaResult);
    const result = await service.findAll(true);

    expect(result).toEqual(expectedProjects);
    expect(mockPrismaService.project.findMany).toHaveBeenCalled();
  });

  it('should find a project by id', async () => {
    const expectedProject = {
      title: 'Test Project',
      shortDescription: 'Test Description',
      userId: 0,
      public: false,
      id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      imgKey: 'base64Image',
    };

    mockPrismaService.project.findUnique.mockResolvedValue(expectedProject);
    const result = await service.findOne(1);

    expect(result).toEqual(expectedProject);
    expect(mockPrismaService.project.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });
});
