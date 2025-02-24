import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EntityRepository } from '../database/entity.repository';
import { Currency, CurrencyDocument } from './entities/currency.entity';

@Injectable()
export class CurrencyRepository extends EntityRepository<CurrencyDocument> {
  constructor(
    @InjectModel(Currency.name) readonly currencyModel: Model<CurrencyDocument>,
  ) {
    super(currencyModel);
  }
}
