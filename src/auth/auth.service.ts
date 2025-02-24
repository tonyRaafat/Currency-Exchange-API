import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../users/users.repository';
import { HashUtil } from '../utils/hash.util';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { TokenPayload } from './interfaces/tokenPayload.interface';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async verifyUser(email: string, password: string) {
    try {
      const user = await this.userRepository.findOne({ email });

      if (!user) {
        throw new UnauthorizedException('Wrong credintials!');
      }

      const passwordMatch = await HashUtil.comparePassword(
        password,
        user.password,
      );

      if (!passwordMatch) {
        throw new UnauthorizedException('Wrong credintials!');
      }

      return user;
    } catch (error) {
      console.log(error);

      throw new UnauthorizedException('Wrong credintials!');
    }
  }

  login(user: User, response: Response) {
    const tokenPayload: TokenPayload = {
      userId: user._id.toHexString(),
    };
    const token = this.jwtService.sign(tokenPayload, {
      secret: this.configService.getOrThrow('JWT_SECERT'),
      expiresIn: '3600000ms',
    });

    response.cookie('Authorization', token, {
      httpOnly: true,
      expires: new Date(Date.now() + 3600000),
    });
  }

  logout(response: Response) {
    response.clearCookie('Authorization');
    return { msg: 'logged out succesfuly' };
  }
}
