/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { HashUtil } from '../utils/hash.util';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './users.repository';
import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    private userRepository: UserRepository,
    private configService: ConfigService,
  ) {}

  async signup(createUserDto: CreateUserDto) {
    try {
      const existingUser = await this.userRepository.findOne({
        email: createUserDto.email,
      });
      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }

      const salt: number = Number(this.configService.getOrThrow('SALT'));
      const hashedPassword = await HashUtil.hashPassword(
        createUserDto.password,
        salt,
      );

      const hashedUser = {
        ...createUserDto,
        password: hashedPassword,
      };
      const newUser = await this.userRepository.create(hashedUser);

      return {
        success: true,
        message: 'User created successfully',
        data: newUser,
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException('Failed to create user');
    }
  }

  async findAll() {
    try {
      const users = await this.userRepository.find({}, { __v: 0, password: 0 });
      return {
        success: true,
        data: users,
      };
    } catch (error) {
      throw new BadRequestException('Failed to fetch users');
    }
  }

  async findOne(user: User) {
    try {
      const userInfo = await this.userRepository.findOne(
        { _id: user?._id },
        { __v: 0, password: 0 },
      );
      if (!userInfo) {
        throw new NotFoundException('User not found');
      }
      return {
        success: true,
        data: user,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to fetch user');
    }
  }

  async update(updateUserDto: UpdateUserDto, user: User) {
    try {
      const existingUser = await this.userRepository.findOne({ _id: user._id });
      if (!existingUser) {
        throw new NotFoundException('User not found');
      }

      if (updateUserDto.password) {
        const salt: number = Number(this.configService.getOrThrow('SALT'));
        updateUserDto.password = await HashUtil.hashPassword(
          updateUserDto.password,
          salt,
        );
      }

      const updatedUser = await this.userRepository.findOneAndUpdate(
        { _id: user._id },
        updateUserDto,
        { new: true, projection: { password: 0, __v: 0 } },
      );

      return {
        success: true,
        message: 'User updated successfully',
        data: updatedUser,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to update user');
    }
  }

  async remove(user: User) {
    const result = await this.userRepository.deleteMany({ _id: user._id });
    if (result === false) {
      throw new NotFoundException('User not found');
    }
    return {
      success: true,
      message: 'User deleted successfully',
    };
  }
}
