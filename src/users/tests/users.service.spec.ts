import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { UserRepository } from '../users.repository';
import { ConfigService } from '@nestjs/config';
import { UserStub } from './stups/user.stup';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { HashUtil } from '../../utils/hash.util';
import { Role } from '../dto/create-user.dto';

jest.mock('../../utils/hash.util', () => ({
  HashUtil: {
    hashPassword: jest.fn().mockResolvedValue('hashedPassword'),
    comparePassword: jest.fn().mockResolvedValue(true),
  },
}));

describe('UsersService', () => {
  let service: UsersService;
  let repository: UserRepository;
  let configService: ConfigService;
  const mockUser = UserStub.create();

  const mockRepository = {
    create: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    deleteMany: jest.fn(),
  };

  const mockConfigService = {
    getOrThrow: jest.fn().mockReturnValue(10),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UserRepository,
          useValue: mockRepository,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<UserRepository>(UserRepository);
    configService = module.get<ConfigService>(ConfigService);
    jest.clearAllMocks();
  });

  describe('signup', () => {
    const createUserDto = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      role: Role.user,
    };

    it('should create a new user successfully', async () => {
      mockRepository.findOne.mockResolvedValueOnce(null);
      mockRepository.create.mockResolvedValueOnce(mockUser);
      jest
        .spyOn(HashUtil, 'hashPassword')
        .mockResolvedValueOnce('hashedPassword');

      const result = await service.signup(createUserDto);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        email: createUserDto.email,
      });
      expect(HashUtil.hashPassword).toHaveBeenCalledWith(
        createUserDto.password,
        10,
      );
      expect(mockRepository.create).toHaveBeenCalled();
      expect(result).toEqual({
        success: true,
        message: 'User created successfully',
        data: mockUser,
      });
    });

    it('should throw ConflictException if user already exists', async () => {
      mockRepository.findOne.mockResolvedValueOnce(mockUser);

      await expect(service.signup(createUserDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const mockUsers = UserStub.createMany(3);
      mockRepository.find.mockResolvedValueOnce(mockUsers);

      const result = await service.findAll();

      expect(mockRepository.find).toHaveBeenCalledWith(
        {},
        { __v: 0, password: 0 },
      );
      expect(result).toEqual({
        success: true,
        data: mockUsers,
      });
    });
  });

  describe('findOne', () => {
    it('should find one user by id', async () => {
      mockRepository.findOne.mockResolvedValueOnce(mockUser);

      const result = await service.findOne(mockUser);

      expect(mockRepository.findOne).toHaveBeenCalledWith(
        { _id: mockUser._id },
        { __v: 0, password: 0 },
      );
      expect(result).toEqual({
        success: true,
        data: mockUser,
      });
    });

    it('should throw NotFoundException when user not found', async () => {
      mockRepository.findOne.mockResolvedValueOnce(null);

      await expect(service.findOne(mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    const updateUserDto = { name: 'Updated Name' };

    it('should update user successfully', async () => {
      mockRepository.findOne.mockResolvedValueOnce(mockUser);
      mockRepository.findOneAndUpdate.mockResolvedValueOnce(UserStub.update());

      const result = await service.update(updateUserDto, mockUser);

      expect(mockRepository.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: mockUser._id },
        updateUserDto,
        { new: true, projection: { password: 0, __v: 0 } },
      );
      expect(result.success).toBeTruthy();
      expect(result.data.name).toBe('Updated Name');
    });

    it('should throw NotFoundException when user not found', async () => {
      mockRepository.findOne.mockResolvedValueOnce(null);

      await expect(service.update(updateUserDto, mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should delete user successfully', async () => {
      mockRepository.deleteMany.mockResolvedValueOnce(true);

      const result = await service.remove(mockUser);

      expect(mockRepository.deleteMany).toHaveBeenCalledWith({
        _id: mockUser._id,
      });
      expect(result).toEqual({
        success: true,
        message: 'User deleted successfully',
      });
    });

    it('should throw NotFoundException when user not found', async () => {
      mockRepository.deleteMany.mockResolvedValueOnce(false);

      await expect(service.remove(mockUser)).rejects.toThrow(NotFoundException);
    });
  });
});
