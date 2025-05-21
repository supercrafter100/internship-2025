import { Test, TestingModule } from '@nestjs/testing';
import { TtnService } from './ttn.service';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTtnCredDto } from '@bsaffer/api/ttncred/dto/create-ttncred.dto';

describe('TtnService', () => {
  let service: TtnService;
  let mockPrismaService: any = {};
  beforeEach(async () => {
    mockPrismaService = {
      ttnProvider: {
        findMany: jest.fn(),
        create: jest.fn(),
        delete: jest.fn(),
        updateMany: jest.fn(),
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TtnService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<TtnService>(TtnService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all TTN credentials for a project', async () => {
    const projectId = 1;
    const mockCredentials = [
      {
        id: 1,
        projectId,
        appUrl: 'a',
        appId: 'app',
        apiKey: 'a',
        createdByid: 1,
        addedAt: new Date(),
      },
      {
        id: 1,
        projectId,
        appUrl: 'a',
        appId: 'app',
        apiKey: 'a',
        addedAt: new Date(),
        createdByid: 1,
      },
    ];

    mockPrismaService.ttnProvider.findMany.mockResolvedValue(mockCredentials);

    const credentials =
      await service.getAllTtnCredentialsFromProject(projectId);
    expect(credentials).toEqual({ ttnCredentials: mockCredentials });
    expect(mockPrismaService.ttnProvider.findMany).toHaveBeenCalledWith({
      where: { projectId },
    });
  });

  it('should create a new TTN credential', async () => {
    const projectId = 1;
    const mockCredential: CreateTtnCredDto = {
      projectId,
      appUrl: 'a',
      appId: 'app',
      apiKey: 'a',
    };

    const prismaReturnValue = {
      ...mockCredential,
      id: 1,
      createdByid: 1,
      addedAt: new Date(),
    };

    mockPrismaService.ttnProvider.create.mockResolvedValue(prismaReturnValue);
    const createdCredential = await service.addTtnCredentialsToProject(
      mockCredential,
      1,
    );
    expect(createdCredential).toEqual(prismaReturnValue);
    expect(mockPrismaService.ttnProvider.create).toHaveBeenCalledWith({
      data: {
        ...mockCredential,
        createdByid: 1,
      },
    });
  });

  it('should delete a TTN credential', async () => {
    const projectId = 1;
    const ttnId = 1;
    const mockCredential = {
      id: ttnId,
      projectId,
      appUrl: 'a',
      appId: 'app',
      apiKey: 'a',
      createdByid: 1,
      addedAt: new Date(),
    };

    mockPrismaService.ttnProvider.delete.mockResolvedValue(mockCredential);
    const deletedCredential = await service.removeTtnCredentialsFromProject(
      projectId,
      ttnId,
    );
    expect(deletedCredential).toEqual(mockCredential);
    expect(mockPrismaService.ttnProvider.delete).toHaveBeenCalledWith({
      where: {
        id: ttnId,
        projectId,
      },
    });
  });

  it('should update a TTN credential', async () => {
    const projectId = 1;
    const ttnId = 1;
    const mockUpdateData = {
      appUrl: 'newUrl',
      appId: 'newApp',
      apiKey: 'newKey',
      createdByid: 1,
    };

    const mockCredential = {
      id: ttnId,
      projectId,
      appUrl: 'a',
      appId: 'app',
      apiKey: 'a',
      createdByid: 1,
      addedAt: new Date(),
    };

    mockPrismaService.ttnProvider.updateMany.mockResolvedValue(mockCredential);
    await service.updateTtnCredentialsFromProject(
      projectId,
      ttnId,
      mockUpdateData,
    );
    expect(mockPrismaService.ttnProvider.updateMany).toHaveBeenCalled();
    expect(mockPrismaService.ttnProvider.updateMany).toHaveBeenCalledWith({
      where: {
        id: ttnId,
        projectId,
      },
      data: {
        ...mockUpdateData,
      },
    });
  });

  it('should get TTN providers for a project', async () => {
    const projectId = 1;
    const mockProviders = [
      {
        id: 1,
        projectId,
        appUrl: 'a',
        appId: 'app',
        apiKey: 'a',
        createdByid: 1,
        addedAt: new Date(),
      },
      {
        id: 2,
        projectId,
        appUrl: 'b',
        appId: 'app2',
        apiKey: 'b',
        createdByid: 1,
        addedAt: new Date(),
      },
    ];

    mockPrismaService.ttnProvider.findMany.mockResolvedValue(mockProviders);
    const providers = await service.getTtnProviders(projectId);
    expect(providers).toEqual(mockProviders);
    expect(mockPrismaService.ttnProvider.findMany).toHaveBeenCalledWith({
      where: { projectId },
    });
  });
});
