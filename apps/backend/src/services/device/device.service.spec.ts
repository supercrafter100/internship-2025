import { Test, TestingModule } from '@nestjs/testing';
import { DeviceService } from './device.service';
import { PrismaService } from '../../prisma/prisma.service';
import { InfluxdbService } from '../../influxdb/influxdb.service';
import { MinioClientService } from '../../minio-client/minio-client.service';

describe('DeviceService', () => {
  let service: DeviceService;
  const mockPrismaService = {
    device: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    deviceParameters: {
      createMany: jest.fn(),
    },
    ttnDeviceDetail: {
      create: jest.fn(),
    },
  };
  const mockInfluxService = {
    queryData: jest.fn(),
  };
  const mockMinioClientService = {
    uploadDeviceBase64Image: jest.fn(),
    listFiles: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeviceService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: InfluxdbService,
          useValue: mockInfluxService,
        },
        {
          provide: MinioClientService,
          useValue: mockMinioClientService,
        },
      ],
    }).compile();

    service = module.get<DeviceService>(DeviceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
