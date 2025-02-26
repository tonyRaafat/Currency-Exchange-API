import {
  Injectable,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { ConvertCurrencyDto } from './dto/convert-currency.dto';
import { User } from '../users/entities/user.entity';
import { CurrencyRepository } from './currency.repository';

@Injectable()
export class CurrencyService {
  private apiKey: string;
  private baseUrl: string;
  constructor(
    private currencyRepository: CurrencyRepository,
    private configService: ConfigService,
  ) {
    this.apiKey = this.configService.getOrThrow<string>('EXCHANGE_API_KEY');
    this.baseUrl = 'https://v6.exchangerate-api.com/v6';
  }

  async convert(convertCurrencyDto: ConvertCurrencyDto, user: User) {
    try {
      const { fromCurrency, toCurrency, amount } = convertCurrencyDto;

      const response = await axios.get(
        `${this.baseUrl}/${this.apiKey}/pair/${fromCurrency}/${toCurrency}/${amount}`,
      );
      if (response.data.result !== 'success') {
        throw new HttpException(
          'Currency conversion failed',
          HttpStatus.BAD_REQUEST,
        );
      }
      const { conversion_rate, conversion_result } = response.data;

      const transaction = await this.currencyRepository.create({
        userId: user._id,
        fromCurrency,
        toCurrency,
        amount,
        convertedAmount: conversion_result,
        rate: conversion_rate,
      });

      return {
        success: true,
        data: transaction,
      };
    } catch (error) {
      console.log(error);

      throw new BadRequestException(
        'Currency conversion failed',
        error.response.data['error-type'],
      );
    }
  }

  async getHistory(user: User) {
    try {
      const history = await this.currencyRepository
        .find({ userId: user._id })
        .sort({ createdAt: -1 });

      return {
        success: true,
        data: history,
      };
    } catch (error) {
      throw new BadRequestException('Failed to fetch conversion history');
    }
  }
}
