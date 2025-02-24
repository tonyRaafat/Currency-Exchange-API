import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { currentUser } from './decorators/currentUser.decorator';
import { User } from '../users/entities/user.entity';
import { Request, Response } from 'express';
import { LocalAuthGaurd } from './guards/localAuth.guard';
import { ApiBody, ApiCookieAuth } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';

@ApiCookieAuth('Authorization')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiBody({ type: LoginDto })
  @UseGuards(LocalAuthGaurd)
  login(@currentUser() user: User, @Res({ passthrough: true }) res: Response) {
    return this.authService.login(user, res);
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    return this.authService.logout(response);
  }

  @Get('cookie-check')
  cookieCheck(@Req() request: Request) {
    return request.headers.cookie;
  }
}
