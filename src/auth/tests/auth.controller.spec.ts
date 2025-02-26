import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { Response } from 'express';
import { UserStub } from '../../users/tests/stups/user.stup';

jest.mock('../auth.service');

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;
  const mockUser = UserStub.create();

  const mockResponse: Partial<Response> = {
    cookie: jest.fn().mockReturnThis(),
    clearCookie: jest.fn().mockReturnThis(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should login user successfully', () => {
      const result = controller.login(mockUser, mockResponse as Response);
      expect(service.login).toHaveBeenCalledWith(mockUser, mockResponse);
      expect(result).toBeUndefined();
    });
  });

  describe('logout', () => {
    it('should logout user successfully', () => {
      const result = controller.logout(mockResponse as Response);
      expect(service.logout).toHaveBeenCalledWith(mockResponse);
      expect(result).toEqual({ msg: 'logged out succesfuly' });
    });
  });

  describe('cookieCheck', () => {
    it('should return cookie headers', () => {
      const mockRequest = {
        headers: {
          cookie: 'Authorization=token123',
        },
      };
      const result = controller.cookieCheck(mockRequest as any);
      expect(result).toBe('Authorization=token123');
    });
  });
});
