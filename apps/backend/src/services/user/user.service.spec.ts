import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../../prisma/prisma.service';
import { UserProfile } from '@bsaffer/common/entity/user.entity';
import { expect } from '@jest/globals';

describe('UserService', () => {
  let service: UserService;
  let mockPrismaService: any = {};

  beforeEach(async () => {
    mockPrismaService = {
      user: {
        upsert: jest.fn(),
        findUnique: jest.fn(),
      },
      projectUser: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        deleteMany: jest.fn(),
        updateMany: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should upsert a user', async () => {
    const userProfile: UserProfile = {
      sub: '123',
      emailVerified: true,
      name: 'John Doe',
      groups: [],
      preferredUsername: 'johndoe',
      givenName: 'John',
      familyName: 'Doe',
      email: 'JohnDoe@test.com',
    };

    const mockUser = {
      name: 'John Doe',
      id: 1,
      providerId: '123',
      email: 'JohnDoe@test.com',
      admin: false,
    };

    mockPrismaService.user.upsert.mockResolvedValue(mockUser);
    const result = await service.registerUser({ profile: userProfile });
    expect(result).toEqual(mockUser);
    expect(mockPrismaService.user.upsert).toHaveBeenCalledWith({
      update: {
        email: userProfile.email.toLowerCase(),
        name: userProfile.name,
      },
      where: {
        providerId: userProfile.sub,
      },
      create: {
        providerId: userProfile.sub,
        email: userProfile.email.toLowerCase(),
        name: userProfile.name,
        admin: false,
      },
    });
  });

  it('should find a user by providerId', async () => {
    const providerId = '123';
    const mockUser = {
      id: 1,
      name: 'John Doe',
      providerId: '123',
      email: 'johndoe@test.com',
      admin: false,
    };

    mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
    const result = await service.getUser(providerId);
    expect(result).toEqual(mockUser);
    expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
      where: {
        providerId,
      },
    });
  });

  it('should throw an error if user not found', async () => {
    const providerId = '123';
    mockPrismaService.user.findUnique.mockResolvedValue(null);

    await expect(service.getUser(providerId)).rejects.toThrow('User not found');
    expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
      where: {
        providerId,
      },
    });
  });

  it('should get user projects', async () => {
    const userId = 1;
    const mockProjects = [
      { id: 1, name: 'Project 1', userId },
      { id: 2, name: 'Project 2', userId },
    ];

    mockPrismaService.projectUser.findMany.mockResolvedValue(mockProjects);
    const result = await service.getUserProjects(userId);
    expect(result).toEqual(mockProjects);
    expect(mockPrismaService.projectUser.findMany).toHaveBeenCalledWith({
      where: {
        userId,
      },
      include: {
        user: true,
      },
    });
  });

  it('should get all project users', async () => {
    const projectId = 1;
    const mockProjectUsers = [
      { id: 1, name: 'User 1', projectId },
      { id: 2, name: 'User 2', projectId },
    ];

    mockPrismaService.projectUser.findMany.mockResolvedValue(mockProjectUsers);
    const result = await service.getAllProjectUsers(projectId);
    expect(result).toEqual(mockProjectUsers);
    expect(mockPrismaService.projectUser.findMany).toHaveBeenCalledWith({
      where: {
        projectId,
      },
      include: {
        user: true,
      },
    });
  });

  it('should create a project user', async () => {
    const projectId = 1;
    const userEmail = 'testUser@test.com';
    const userWithEmail = {
      id: 1,
      name: 'Test User',
      email: userEmail,
    };

    const projectUser = {
      id: 1,
      projectId,
      userId: 1,
      admin: false,
    };

    mockPrismaService.user.findUnique.mockResolvedValue(userWithEmail);
    mockPrismaService.projectUser.findFirst.mockResolvedValue(null);
    mockPrismaService.projectUser.create.mockResolvedValue(projectUser);

    const result = await service.addUserToProject(projectId, userEmail);
    expect(result).toEqual(projectUser);
    expect(mockPrismaService.projectUser.create).toHaveBeenCalledWith({
      data: {
        projectId,
        userId: userWithEmail.id,
        admin: projectUser.admin,
      },
    });
  });

  it('should throw an error if user does not exist', async () => {
    const projectId = 1;

    mockPrismaService.user.findUnique.mockResolvedValue(null);
    await expect(
      service.addUserToProject(projectId, 'test@test.com'),
    ).rejects.toThrow('User not found');
    expect(mockPrismaService.projectUser.findFirst).not.toHaveBeenCalled();
    expect(mockPrismaService.projectUser.create).not.toHaveBeenCalled();
  });

  it('should throw an error if user is already added to the project', async () => {
    const projectId = 1;
    const userEmail = 'test@test.com';
    const existingUser = {
      id: 1,
      name: 'Test User',
      email: userEmail,
    };

    const existingProjectUser = {
      id: 1,
      projectId,
      userId: 1,
      admin: false,
    };

    mockPrismaService.user.findUnique.mockResolvedValue(existingUser);
    mockPrismaService.projectUser.findFirst.mockResolvedValue(
      existingProjectUser,
    );
    await expect(
      service.addUserToProject(projectId, userEmail),
    ).rejects.toThrow('User is already added to the project');

    expect(mockPrismaService.projectUser.create).not.toHaveBeenCalled();
    expect(mockPrismaService.projectUser.findFirst).toHaveBeenCalledWith({
      where: {
        projectId,
        userId: existingUser.id,
      },
    });
  });

  it('should remove a user from a project', async () => {
    const projectId = 1;
    const userId = '1';
    const mockProjectUser = {
      id: 1,
      projectId,
      userId: Number(userId),
    };

    mockPrismaService.projectUser.deleteMany.mockResolvedValue(mockProjectUser);
    const result = await service.removeUserFromProject(projectId, userId);
    expect(result).toEqual(mockProjectUser);
    expect(mockPrismaService.projectUser.deleteMany).toHaveBeenCalledWith({
      where: {
        projectId,
        userId: Number(userId),
      },
    });
  });

  it('should update admin status of a user in a project', async () => {
    const projectId = 1;
    const userId = '1';
    const adminStatus = true;
    const mockProjectUser = {
      id: 1,
      projectId,
      userId: Number(userId),
      admin: adminStatus,
    };

    mockPrismaService.projectUser.updateMany.mockResolvedValue(mockProjectUser);
    const result = await service.updateAdminStatus(
      projectId,
      userId,
      adminStatus,
    );
    expect(result).toEqual(mockProjectUser);
    expect(mockPrismaService.projectUser.updateMany).toHaveBeenCalledWith({
      where: {
        userId: Number(userId),
        projectId: Number(projectId),
      },
      data: {
        admin: adminStatus,
      },
    });
  });
});
