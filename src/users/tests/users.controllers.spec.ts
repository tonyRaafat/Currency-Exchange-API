import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { CreateUserDto, Role } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserStub } from './stups/user.stup';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

jest.mock('../users.service');

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;
  const mockUser = UserStub.create();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createUserDto: CreateUserDto = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      role: Role.user,
    };

    it('should successfully create a user', async () => {
      const result = await controller.create(createUserDto);
      expect(service.signup).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual({
        success: true,
        message: 'User created successfully',
        data: mockUser,
      });
    });

    it('should handle duplicate email error', async () => {
      jest
        .spyOn(service, 'signup')
        .mockRejectedValue(
          new ConflictException('User with this email already exists'),
        );
      await expect(controller.create(createUserDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const mockUsers = UserStub.createMany(3);
      const result = await controller.findAll(mockUser);
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual({
        success: true,
        data: mockUsers,
      });
    });

    it('should handle find all failure', async () => {
      jest
        .spyOn(service, 'findAll')
        .mockRejectedValue(new BadRequestException('Failed to fetch users'));
      await expect(controller.findAll(mockUser)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findOne', () => {
    it('should return user profile', async () => {
      const result = await controller.findOne(mockUser);
      expect(service.findOne).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual({
        success: true,
        data: mockUser,
      });
    });

    it('should handle user not found', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockRejectedValue(new NotFoundException('User not found'));
      await expect(controller.findOne(mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    const updateUserDto: UpdateUserDto = {
      name: 'Updated Name',
    };

    it('should successfully update user', async () => {
      const updatedUser = { ...mockUser, ...updateUserDto };
      const result = await controller.update(updateUserDto, mockUser);
      expect(service.update).toHaveBeenCalledWith(updateUserDto, mockUser);
      expect(result).toEqual({
        success: true,
        message: 'User updated successfully',
        data: updatedUser,
      });
    });

    it('should handle update failure', async () => {
      jest
        .spyOn(service, 'update')
        .mockRejectedValue(new BadRequestException('Failed to update user'));
      await expect(controller.update(updateUserDto, mockUser)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('remove', () => {
    it('should successfully delete user', async () => {
      const result = await controller.remove(mockUser);
      expect(service.remove).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual({
        success: true,
        message: 'User deleted successfully',
      });
    });

    it('should handle delete failure', async () => {
      jest
        .spyOn(service, 'remove')
        .mockRejectedValue(new NotFoundException('User not found'));
      await expect(controller.remove(mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
