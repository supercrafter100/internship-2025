import { Test, TestingModule } from '@nestjs/testing';
import { ApikeyController } from './apikey.controller';
import { ApikeyService } from '../../services/apikey/apikey.service';
import * as mocks from 'node-mocks-http';
import { UnauthorizedException } from '@nestjs/common';
import { expect } from '@jest/globals';

describe('ApikeyController', () => {
  let controller: ApikeyController;
  let mockApiKeyService: any;

  beforeEach(async () => {
    mockApiKeyService = {
      getProjectKeys: jest.fn(),
      createApiKey: jest.fn(),
      getApiKey: jest.fn(),
      deleteApiKey: jest.fn(),
    };

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

  describe('getProjectKeys', () => {
    it('should return an array of API keys WITH admin', async () => {
      const result = [
        { id: 1, name: 'Key1', key: 'abc', projectId: 1 },
        { id: 2, name: 'Key2', key: 'abc', projectId: 1 },
      ];
      mockApiKeyService.getProjectKeys.mockResolvedValue(result);

      const request = mocks.createRequest();
      request.session = {
        internalUser: { admin: true },
        projects: [{ id: 1, admin: true }],
      } as any;

      const response = await controller.getProjectKeys('5', request as any);

      expect(response).toEqual(result);
      expect(mockApiKeyService.getProjectKeys).toHaveBeenCalledWith(5);
    });

    it('should throw UnauthorizedException if session is missing', async () => {
      const request = mocks.createRequest();
      request.session = undefined as any;
      // request.session is undefined

      await expect(
        controller.getProjectKeys('5', request as any),
      ).rejects.toThrow(UnauthorizedException);

      expect(mockApiKeyService.getProjectKeys).not.toHaveBeenCalled();
    });

    it('should get API keys WITHOUT admin WITH project access', async () => {
      const result = [{ id: 1, name: 'Key1', key: 'abc', projectId: 5 }];
      mockApiKeyService.getProjectKeys.mockResolvedValue(result);

      const request = mocks.createRequest();
      request.session = {
        internalUser: { admin: false },
        projects: [{ id: 5, admin: true }],
      } as any;

      const response = await controller.getProjectKeys('5', request as any);

      expect(response).toEqual(result);
      expect(mockApiKeyService.getProjectKeys).toHaveBeenCalledWith(5);
    });

    it('should throw UnauthorizedException if user is not admin and not part of the project', async () => {
      const request = mocks.createRequest();
      request.session = {
        internalUser: { admin: false },
        projects: [{ id: 1, admin: false }],
      } as any;

      await expect(
        controller.getProjectKeys('5', request as any),
      ).rejects.toThrow(UnauthorizedException);

      expect(mockApiKeyService.getProjectKeys).not.toHaveBeenCalled();
    });

    it('should return an array of API keys WITHOUT admin WITH project access', async () => {
      const result = [
        { id: 1, name: 'Key1', key: 'abc', projectId: 1 },
        { id: 2, name: 'Key2', key: 'abc', projectId: 1 },
      ];
      mockApiKeyService.getProjectKeys.mockResolvedValue(result);

      const request = mocks.createRequest();
      request.session = {
        internalUser: { admin: false },
        projects: [{ id: 5, admin: true }],
      } as any;

      const response = await controller.getProjectKeys('5', request as any);

      expect(response).toEqual(result);
      expect(mockApiKeyService.getProjectKeys).toHaveBeenCalledWith(5);
    });

    it('should create an API key WITHOUT admin WITH project access', async () => {
      const result = { id: 1, name: 'Key1', key: 'abc', projectId: 5 };
      mockApiKeyService.createApiKey.mockResolvedValue(result);

      const request = mocks.createRequest();
      request.session = {
        internalUser: { admin: false },
        projects: [{ id: 5, admin: true }],
      } as any;

      const response = await controller.createApiKey(
        '5',
        { name: 'Key1' },
        request as any,
      );

      expect(response).toEqual(result);
      expect(mockApiKeyService.createApiKey).toHaveBeenCalledWith(5, 'Key1');
    });
  });

  describe('createApiKey', () => {
    it('should create an API key WITH admin', async () => {
      const result = { id: 1, name: 'Key1', key: 'abc', projectId: 1 };
      mockApiKeyService.createApiKey.mockResolvedValue(result);

      const request = mocks.createRequest();
      request.session = {
        internalUser: { admin: true },
        projects: [{ id: 1, admin: true }],
      } as any;

      const response = await controller.createApiKey(
        '5',
        { name: 'Key1' },
        request as any,
      );

      expect(response).toEqual(result);
      expect(mockApiKeyService.createApiKey).toHaveBeenCalledWith(5, 'Key1');
    });

    it('should not create an API key WITHOUT admin WITHOUT project access', async () => {
      const request = mocks.createRequest();
      request.session = {
        internalUser: { admin: false },
        projects: [{ id: 1, admin: false }],
      } as any;

      await expect(
        controller.createApiKey('5', { name: 'Key1' }, request as any),
      ).rejects.toThrow(UnauthorizedException);
      expect(mockApiKeyService.createApiKey).not.toHaveBeenCalled();
    });
  });

  describe('deleteApiKey', () => {
    it('should delete an API key WITH admin', async () => {
      const result = { id: 1, name: 'Key1', key: 'abc', projectId: 1 };
      mockApiKeyService.getApiKey.mockResolvedValue(result);
      mockApiKeyService.deleteApiKey.mockResolvedValue(result);

      const request = mocks.createRequest();
      request.session = {
        internalUser: { admin: true },
        projects: [{ id: 1, admin: true }],
      } as any;

      const response = await controller.deleteApiKey('1', request as any);

      expect(response).toEqual(undefined);
      expect(mockApiKeyService.getApiKey).toHaveBeenCalledWith(1);
      expect(mockApiKeyService.deleteApiKey).toHaveBeenCalledWith(1);
    });

    it('should not delete an API key if api key does not exist', async () => {
      mockApiKeyService.getApiKey.mockResolvedValue(null);

      const request = mocks.createRequest();
      request.session = {
        internalUser: { admin: true },
        projects: [{ id: 1, admin: true }],
      } as any;

      await expect(
        controller.deleteApiKey('1', request as any),
      ).rejects.toThrow(UnauthorizedException);
      expect(mockApiKeyService.getApiKey).toHaveBeenCalledWith(1);
      expect(mockApiKeyService.deleteApiKey).not.toHaveBeenCalled();
    });

    it('should not delete an API key WITHOUT admin WITHOUT project access', async () => {
      const request = mocks.createRequest();
      request.session = {
        internalUser: { admin: false },
        projects: [{ id: 1, admin: false }],
      } as any;

      await expect(
        controller.deleteApiKey('1', request as any),
      ).rejects.toThrow(UnauthorizedException);
      expect(mockApiKeyService.getApiKey).toHaveBeenCalled();
      expect(mockApiKeyService.deleteApiKey).not.toHaveBeenCalled();
    });

    it('should delete API key WITHOUT admin WITHOUT project access', async () => {
      const apiKey = { id: 1, name: 'Key1', key: 'abc', projectId: 5 };
      mockApiKeyService.getApiKey.mockResolvedValue(apiKey);
      mockApiKeyService.deleteApiKey.mockResolvedValue(undefined);
      const request = mocks.createRequest();
      request.session = {
        internalUser: { admin: false },
        projects: [{ id: 1, admin: false }],
      } as any;
      await expect(
        controller.deleteApiKey('1', request as any),
      ).rejects.toThrow(UnauthorizedException);
      expect(mockApiKeyService.getApiKey).toHaveBeenCalledWith(1);
      expect(mockApiKeyService.deleteApiKey).not.toHaveBeenCalled();
    });

    it('should delete API key WITHOUT admin WITH project access', async () => {
      const apiKey = { id: 1, name: 'Key1', key: 'abc', projectId: 5 };
      mockApiKeyService.getApiKey.mockResolvedValue(apiKey);
      mockApiKeyService.deleteApiKey.mockResolvedValue(undefined);

      const request = mocks.createRequest();
      request.session = {
        internalUser: { admin: false },
        projects: [{ id: 5, admin: true }],
      } as any;

      const response = await controller.deleteApiKey('1', request as any);

      expect(response).toBeUndefined();
      expect(mockApiKeyService.deleteApiKey).toHaveBeenCalledWith(1);
    });
  });
});
