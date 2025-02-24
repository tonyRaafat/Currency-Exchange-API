import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenPayload } from '../interfaces/tokenPayload.interface';
import { UserRepository } from '../../users/users.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private readonly userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request): any => request.cookies?.Authorization,
      ]),
      secretOrKey: configService.getOrThrow('JWT_SECERT'),
    });
  }

  validate(payload: TokenPayload) {
    return this.userRepository.findOne({ _id: payload.userId });
  }
}
