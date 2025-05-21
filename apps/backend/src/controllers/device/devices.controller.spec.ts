import { Test, TestingModule } from '@nestjs/testing';
import { DevicesController } from './devices.controller';
import { DeviceService } from '../../services/device/device.service';
import { ApikeyService } from '../../services/apikey/apikey.service';

describe('DevicesController', () => {
  let controller: DevicesController;
  const mockDevicesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findAllForProjects: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    setTTNParameters: jest.fn(),
    getAllMeasurementsForDevice: jest.fn(),
    getSpecificMeasurementsForDevice: jest.fn(),
    generateCsvFromMeasurements: jest.fn(),
    getCameraFiles: jest.fn(),
  };

  const mockApiKeyService = {
    getApiKey: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DevicesController],
      providers: [
        {
          provide: DeviceService,
          useValue: mockDevicesService,
        },
        {
          provide: ApikeyService,
          useValue: mockApiKeyService,
        },
      ],
    }).compile();

    controller = module.get<DevicesController>(DevicesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
