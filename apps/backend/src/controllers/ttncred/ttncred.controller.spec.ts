import { Test, TestingModule } from '@nestjs/testing';
import { TtncredController } from './ttncred.controller';
import { TtnService } from '../../services/ttn/ttn.service';

describe('TtncredController', () => {
  let controller: TtncredController;
  const mockTtnService = {
    getAllTtnCredentialsFromProject: jest.fn(),
    addTtnCredentialsToProject: jest.fn(),
    removeTtnCredentialsFromProject: jest.fn(),
    getTtnProviders: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TtncredController],
      providers: [
        {
          provide: TtnService,
          useValue: mockTtnService,
        },
      ],
    }).compile();

    controller = module.get<TtncredController>(TtncredController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
