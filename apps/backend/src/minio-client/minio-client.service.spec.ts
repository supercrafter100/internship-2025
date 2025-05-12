import { Test, TestingModule } from '@nestjs/testing';
import { MinioClientService } from './minio-client.service';
import { MinioService } from 'nestjs-minio-client';

describe('MinioClientService', () => {
  let service: MinioClientService;
  const mockMinioService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MinioClientService,
        {
          provide: MinioService,
          useValue: mockMinioService,
        },
      ],
    }).compile();

    service = module.get<MinioClientService>(MinioClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
