import { Test, TestingModule } from '@nestjs/testing';
import { DeviceService } from './device.service';
import { PrismaService } from '../../prisma/prisma.service';
import { InfluxdbService } from '../../influxdb/influxdb.service';
import { MinioClientService } from '../../minio-client/minio-client.service';
import { Decimal } from '@prisma/client/runtime/library';
import { CreateDeviceDto } from '@bsaffer/api/device/dto/create-device.dto';
import { UpdateDeviceDto } from '@bsaffer/api/device/dto/update-device.dto';
import { SetupTTNParametersDTO } from '@bsaffer/api/device/dto/setupTTNParameters.dto';
import { expect } from '@jest/globals';

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

  it('should find a device by id', async () => {
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
    };

    mockPrismaService.device.findUnique.mockResolvedValue(expectedResult);

    const result = await service.findOne('abc123');
    expect(result).toEqual(expectedResult);
    expect(mockPrismaService.device.findUnique).toHaveBeenCalledWith({
      where: { id: 'abc123' },
    });
  });

  it('should set TTN parameters for a device', async () => {
    const setupTTNParameters: SetupTTNParametersDTO = {
      ttnDeviceId: 'device123',
      ttnProviderId: 5,
    };

    const expectedResult = {
      id: 1,
      ttnDeviceId: 'device123',
      ttnProviderId: 5,
      deviceId: 'abc',
    };

    mockPrismaService.ttnDeviceDetail.create.mockResolvedValue(expectedResult);

    const result = await service.setTTNParameters('abc123', setupTTNParameters);
    expect(result).toEqual(expectedResult);
    expect(mockPrismaService.ttnDeviceDetail.create).toHaveBeenCalledWith({
      data: {
        ttnDeviceId: setupTTNParameters.ttnDeviceId,
        ttnProviderId: setupTTNParameters.ttnProviderId,
        deviceId: 'abc123',
      },
    });
  });

  it('getAllMeasurementsForDevice should call influx queryData', async () => {
    const expectedResult = [
      {
        time: '2023-10-01T00:00:00Z',
        value: 25,
      },
      {
        time: '2023-10-01T00:05:00Z',
        value: 26,
      },
      {
        time: '2023-10-01T00:10:00Z',
        value: 27,
      },
    ];

    mockInfluxService.queryData.mockResolvedValue(expectedResult);

    const result = await service.getAllMeasurementsForDevice('abc123');
    expect(result).toEqual(expectedResult);
    expect(mockInfluxService.queryData).toHaveBeenCalledWith(
      `from(bucket: "${process.env.INFLUXDB_BUCKET}")
        |> range(start: 0)
        |> filter(fn: (r) => r._measurement == "mqtt_data" and r.device_id == "abc123")
        |> aggregateWindow(every: 5s, fn: last, createEmpty: false) 
        |> pivot(rowKey:["device_id","_time"], columnKey:["_field"], valueColumn:"_value")
        |> drop(columns: ["_start", "_stop", "_measurement", "result", "table", "device"])
        |> sort(columns:["_time"])`,
    );
  });

  it('getspecificMeasurementsForDevice should call influx queryData', async () => {
    const expectedResult = [
      {
        time: '2023-10-01T00:00:00Z',
        value: 25,
      },
      {
        time: '2023-10-01T00:05:00Z',
        value: 26,
      },
      {
        time: '2023-10-01T00:10:00Z',
        value: 27,
      },
    ];

    mockInfluxService.queryData.mockResolvedValue(expectedResult);

    const result = await service.getSpecificMeasurementsForDevice(
      '1',
      '2023-7-01T00:00:00Z',
      '2023-10-01T00:10:00Z',
    );
    expect(result).toEqual(expectedResult);
    expect(mockInfluxService.queryData).toHaveBeenCalledWith(
      `from(bucket: "${process.env.INFLUXDB_BUCKET}")
        |> range(start: 2023-7-01T00:00:00Z, stop: 2023-10-01T00:10:00Z)  // Gebruik start en end als parameters
        |> filter(fn: (r) => r._measurement == "mqtt_data" and r.device_id == "1")
        |> aggregateWindow(every: 5s, fn: last, createEmpty: false) 
        |> pivot(rowKey:["device_id","_time"], columnKey:["_field"], valueColumn:"_value")
        |> drop(columns: ["_start", "_stop", "_measurement", "device_id"])
        |> sort(columns:["_time"])`,
    );
  });

  it('should find all devices for a project', async () => {
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

    const result = await service.findAllForProject(1);
    expect(result).toEqual(expectedResult);
    expect(mockPrismaService.device.findMany).toHaveBeenCalledWith({
      where: { projectId: 1 },
    });
  });

  // Todo change to real test
  it('should update a device', () => {
    const updateDeviceDto: UpdateDeviceDto = {
      deviceType: 'sensor',
      projectId: 1,
      latitude: 52.3702,
      longitude: 4.8952,
    };

    const result = service.update(1, updateDeviceDto);
    expect(result).toEqual(`This action updates a #${1} device`);
  });
  // Todo change to real test
  it('should remove a device', () => {
    const result = service.remove(1);
    expect(result).toEqual(`This action removes a #${1} device`);
  });

  it('should retrieve camera files from a device', async () => {
    const expectedResult = [
      {
        name: 'image1.mp4',
        size: 12345,
      },
      {
        name: 'image2.mp4',
        size: 67890,
      },
    ];

    mockMinioClientService.listFiles.mockResolvedValue(expectedResult);

    const result = await service.getCameraFiles('abc123');
    expect(result).toEqual(expectedResult);
    expect(mockMinioClientService.listFiles).toHaveBeenCalledWith(
      'videos/abc123',
    );
  });

  it('should generate a CSV file for a device', async () => {
    const mockMeasurements = [
      {
        time: '2023-10-01T00:00:00Z',
        value: 25,
      },
      {
        time: '2023-10-01T00:05:00Z',
        value: 26,
      },
    ];

    mockInfluxService.queryData.mockResolvedValue(mockMeasurements);
    const result = await service.generateCsvFromMeasurements(
      'abc123',
      '2023-10-01T00:00:00Z',
      '2023-10-01T00:10:00Z',
    );
    expect(result).not.toBeNull();
  });

  it('should fail if no measurements are found for csv', async () => {
    const mockMeasurements = [];

    mockInfluxService.queryData.mockResolvedValue(mockMeasurements);
    await expect(
      service.generateCsvFromMeasurements(
        'abc123',
        '2023-10-01T00:00:00Z',
        '2023-10-01T00:10:00Z',
      ),
    ).rejects.toThrow('Geen meetgegevens gevonden voor dit apparaat.');
  });
});
