import { Test, TestingModule } from '@nestjs/testing';
import { ApikeyService } from './apikey.service';
import { PrismaService } from '../../prisma/prisma.service';
import { expect } from '@jest/globals';

describe('ApikeyService', () => {
  let service: ApikeyService;
  const mockPrismaService = {
    apiKey: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApikeyService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ApikeyService>(ApikeyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return project api keys', async () => {
    const projectId = 1;
    const mockKeys = [
      { id: 1, name: 'Key 1', key: 'key1', projectId },
      { id: 2, name: 'Key 2', key: 'key2', projectId },
    ];

    mockPrismaService.apiKey.findMany.mockResolvedValue(mockKeys);

    const keys = await service.getProjectKeys(projectId);
    expect(keys).toEqual(mockKeys);
    expect(mockPrismaService.apiKey.findMany).toHaveBeenCalledWith({
      where: { projectId },
    });
  });

  it('should return a project api key', async () => {
    const key = 5;
    const mockKey = { id: 5, name: 'Key 1', key, projectId: 1 };

    mockPrismaService.apiKey.findUnique.mockResolvedValue(mockKey);

    const foundKey = await service.getApiKey(key);
    expect(foundKey).toEqual(mockKey);
    expect(mockPrismaService.apiKey.findUnique).toHaveBeenCalledWith({
      where: { id: key },
    });
  });

  it('should create a new api key', async () => {
    const projectId = 1;
    const name = 'New Key';

    const mockKey = { id: 1, name, key: 'newKey', projectId };
    mockPrismaService.apiKey.create.mockResolvedValue(mockKey);

    const createdKey = await service.createApiKey(projectId, name);
    expect(createdKey).toEqual(mockKey);
    expect(mockPrismaService.apiKey.create).toHaveBeenCalledWith({
      data: {
        projectId,
        name,
        key: expect.any(String),
      },
    });
  });

  it('should delete an api key', async () => {
    const keyId = 1;
    const mockKey = { id: keyId, name: 'Key 1', key: 'key1', projectId: 1 };

    mockPrismaService.apiKey.delete.mockResolvedValue(mockKey);

    const deletedKey = await service.deleteApiKey(keyId);
    expect(deletedKey).toEqual(mockKey);
    expect(mockPrismaService.apiKey.delete).toHaveBeenCalledWith({
      where: { id: keyId },
    });
  });

  it('should get an apikey by its key', async () => {
    const key = 'abc123';
    const mockKey = { id: 1, name: 'Key 1', key, projectId: 1 };
    mockPrismaService.apiKey.findUnique.mockResolvedValue(mockKey);
    const foundKey = await service.getApiKeyByKey(key);
    expect(foundKey).toEqual(mockKey);
    expect(mockPrismaService.apiKey.findUnique).toHaveBeenCalledWith({
      where: { key },
    });
  });
});
