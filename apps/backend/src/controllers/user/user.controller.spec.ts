import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from '../../services/user/user.service';

describe('UserController', () => {
  let controller: UserController;
  const mockUserService = {
    getUserProjects: jest.fn(),
    getAllProjectUsers: jest.fn(),
    updateAdminStatus: jest.fn(),
    addUserToProject: jest.fn(),
    removeUserFromProject: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
