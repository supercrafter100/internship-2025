import { Test, TestingModule } from '@nestjs/testing';
import { ApikeyController } from './apikey.controller';
import { ApikeyService } from '../../services/apikey/apikey.service';

describe('ApikeyController', () => {
  let controller: ApikeyController;
  const mockApiKeyService = {
    getProjectKeys: jest.fn(),
    createApiKey: jest.fn(),
    getApiKey: jest.fn(),
    deleteApiKey: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApikeyController],
      providers: [
        {
          provide: ApikeyService,
          useValue: mockApiKeyService,
        },
      ],
    }).compile();

    controller = module.get<ApikeyController>(ApikeyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
