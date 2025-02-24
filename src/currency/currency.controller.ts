import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { ConvertCurrencyDto } from './dto/convert-currency.dto';
import { currentUser } from '../auth/decorators/currentUser.decorator';
import { User } from '../users/entities/user.entity';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGaurd } from 'src/auth/guards/jwtAuth.guard';

@ApiTags('currency')
@ApiBearerAuth()
@Controller('currency')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Post('convert')
  @UseGuards(JwtAuthGaurd)
  convert(
    @Body() convertCurrencyDto: ConvertCurrencyDto,
    @currentUser() user: User,
  ) {
    return this.currencyService.convert(convertCurrencyDto, user);
  }

  @Get('history')
  @UseGuards(JwtAuthGaurd)
  getHistory(@currentUser() user: User) {
    return this.currencyService.getHistory(user);
  }
}
