import { TransactionStub } from '../tests/stups/transaction.stup';

export const CurrencyService = jest.fn().mockReturnValue({
  convert: jest.fn().mockResolvedValue({
    success: true,
    data: TransactionStub.create(),
  }),
  getHistory: jest.fn().mockResolvedValue({
    success: true,
    data: TransactionStub.createMany(3),
  }),
});
