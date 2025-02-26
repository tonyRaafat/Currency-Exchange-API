import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UserRepository } from '../../users/users.repository';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { UserStub } from '../../users/tests/stups/user.stup';
import { HashUtil } from '../../utils/hash.util';
import { Response } from 'express';

jest.mock('../../utils/hash.util');

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: UserRepository;
  let jwtService: JwtService;
  const mockUser = UserStub.create();

  const mockUserRepository = {
    findOne: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mockToken'),
  };

  const mockConfigService = {
    getOrThrow: jest.fn().mockReturnValue('mockSecret'),
  };

  const mockResponse: Partial<Response> = {
    cookie: jest.fn().mockReturnThis(),
    clearCookie: jest.fn().mockReturnThis(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<UserRepository>(UserRepository);
    jwtService = module.get<JwtService>(JwtService);
    jest.clearAllMocks();
  });

  describe('verifyUser', () => {
    it('should verify user successfully', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      jest.spyOn(HashUtil, 'comparePassword').mockResolvedValue(true);

      const result = await service.verifyUser('test@email.com', 'password123');

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        email: 'test@email.com',
      });
      expect(HashUtil.comparePassword).toHaveBeenCalledWith(
        'password123',
        mockUser.password,
      );
      expect(result).toEqual(mockUser);
    });

    it('should throw UnauthorizedException when user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(
        service.verifyUser('test@email.com', 'password123'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when password is incorrect', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      jest.spyOn(HashUtil, 'comparePassword').mockResolvedValue(false);

      await expect(
        service.verifyUser('test@email.com', 'wrongpassword'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('login', () => {
    it('should set cookie with JWT token', () => {
      service.login(mockUser, mockResponse as Response);

      expect(jwtService.sign).toHaveBeenCalledWith(
        { userId: mockUser._id.toHexString() },
        {
          secret: 'mockSecret',
          expiresIn: '3600000ms',
        },
      );
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'Authorization',
        'mockToken',
        {
          httpOnly: true,
          expires: expect.any(Date),
        },
      );
    });
  });

  describe('logout', () => {
    it('should clear authorization cookie', () => {
      const result = service.logout(mockResponse as Response);

      expect(mockResponse.clearCookie).toHaveBeenCalledWith('Authorization');
      expect(result).toEqual({ msg: 'logged out succesfuly' });
    });
  });
});
