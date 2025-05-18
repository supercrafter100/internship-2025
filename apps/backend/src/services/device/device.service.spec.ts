import { Test, TestingModule } from '@nestjs/testing';
import { DeviceService } from './device.service';
import { PrismaService } from '../../prisma/prisma.service';
import { InfluxdbService } from '../../influxdb/influxdb.service';
import { MinioClientService } from '../../minio-client/minio-client.service';
import { Decimal } from '@prisma/client/runtime/library';
import { CreateDeviceDto } from '@bsaffer/api/device/dto/create-device.dto';
import { de } from '@faker-js/faker/.';
import { mock } from 'node:test';

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

  //BACKEND TESTS 01_2
  it('should create a device', async () => {
    const mockDevice: CreateDeviceDto = {
      projectId: 1,
      deviceType: 'sensor',
      deviceName: 'Test Device',
      deviceImage: 'base64ImageString',
      deviceDescription: 'Test Description',
      latitude: 52.3702,
      longitude: 4.8952,
      deviceParameters: [{ name: 'temperature', description: 'bme280' }],
    };

    const expectedResult = {
      id: 'abc123',
      deviceType: 'sensor',
      projectId: 1,
      name: 'Test Device',
      description: 'Test Description',
      latitude: '52.3702' as unknown as Decimal,
      longitude: '4.8952' as unknown as Decimal,
      imgKey: 'base64ImageString',
      createdByid: null,
      createdAt: new Date(),
      deviceParameters: [
        {
          id: 1,
          deviceId: 'abc123',
          name: 'temperature',
          description: 'bme280',
        },
      ],
    };

    const expectedPrismaResult = {
      id: expectedResult.id,
      createdAt: expectedResult.createdAt,
      createdByid: expectedResult.createdByid,
      deviceType: mockDevice.deviceType.toString(),
      imgKey: expectedResult.imgKey,
      name: mockDevice.deviceName,
      description: mockDevice.deviceDescription,
      latitude: mockDevice.latitude.toString(),
      longitude: mockDevice.longitude.toString(),
      projectId: mockDevice.projectId,
      deviceParameters: [
        {
          id: 1,
          deviceId: 'abc123',
          name: 'temperature',
          description: 'bme280',
        },
      ],
    };

    const expectedPrismaCall = {
      deviceType: mockDevice.deviceType.toString(),
      imgKey: 'base64ImageString',
      name: mockDevice.deviceName,
      description: mockDevice.deviceDescription,
      latitude: mockDevice.latitude.toString(),
      longitude: mockDevice.longitude.toString(),
      projectId: mockDevice.projectId,
      deviceParameters: {
        create: mockDevice.deviceParameters,
      },
    };

    // Mocked created device
    mockPrismaService.device.create.mockResolvedValue(expectedPrismaResult);
    mockMinioClientService.uploadDeviceBase64Image.mockResolvedValue(
      'base64ImageString',
    );

    const result = await service.create(mockDevice);
    expect(result).toEqual(expectedResult);
    expect(mockPrismaService.device.create).toHaveBeenCalledWith({
      data: expectedPrismaCall,
    });
  });

  it('should find all devices', async () => {
    const expectedResult = [
      {
        id: 'abc123',
        deviceType: 'sensor',
        projectId: 1,
        name: 'Test Device',
        description: 'Test Description',
        latitude: '52.3702' as unknown as Decimal,
        longitude: '4.8952' as unknown as Decimal,
        imgKey: 'base64ImageString',
        createdByid: null,
        createdAt: new Date(),
      },
    ];

    mockPrismaService.device.findMany.mockResolvedValue(expectedResult);

    const result = await service.findAll();
    expect(result).toEqual(expectedResult);
    expect(mockPrismaService.device.findMany).toHaveBeenCalled();
  });
});
