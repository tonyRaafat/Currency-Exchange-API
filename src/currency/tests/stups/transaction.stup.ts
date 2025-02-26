import { Types } from 'mongoose';
import { Currency } from 'src/currency/entities/currency.entity';

export class TransactionStub {
  static create(): Currency {
    return {
      _id: new Types.ObjectId('507f1f77bcf86cd799439011'),
      userId: new Types.ObjectId('507f1f77bcf86cd799439022'),
      fromCurrency: 'USD',
      toCurrency: 'EUR',
      amount: 100.5,
      convertedAmount: 95.94735,
      rate: 0.9547,
    };
  }

  static createMany(count: number): Currency[] {
    return Array(count)
      .fill(null)
      .map(() => this.create());
  }
}
