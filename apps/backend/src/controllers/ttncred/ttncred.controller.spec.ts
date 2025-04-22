import { Test, TestingModule } from '@nestjs/testing';
import { TtncredController } from './ttncred.controller';

describe('TtncredController', () => {
  let controller: TtncredController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TtncredController],
    }).compile();

    controller = module.get<TtncredController>(TtncredController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
