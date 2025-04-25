import { Test, TestingModule } from '@nestjs/testing';
import { TtnService } from './ttn.service';

describe('TtnService', () => {
  let service: TtnService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TtnService],
    }).compile();

    service = module.get<TtnService>(TtnService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
