import { Test, TestingModule } from '@nestjs/testing';
import { ApikeyService } from './apikey.service';
import { PrismaService } from '../../prisma/prisma.service';

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
});
