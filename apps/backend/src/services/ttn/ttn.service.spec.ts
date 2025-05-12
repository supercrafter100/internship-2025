import { Test, TestingModule } from '@nestjs/testing';
import { TtnService } from './ttn.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('TtnService', () => {
  let service: TtnService;
  const mockPrismaService = {
    ttnProvider: {
      findMany: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
      updateMany: jest.fn(),
    },
  };
  beforeEach(async () => {
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
});
