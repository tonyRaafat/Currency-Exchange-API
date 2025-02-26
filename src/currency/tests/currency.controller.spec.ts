import { Test, TestingModule } from '@nestjs/testing';
import { CurrencyController } from '../currency.controller';
import { CurrencyService } from '../currency.service';
import { UserStub } from '../../users/tests/stups/user.stup';
import { TransactionStub } from './stups/transaction.stup';
import { BadRequestException } from '@nestjs/common';

jest.mock('../currency.service.ts');

describe('CurrencyController', () => {
  let controller: CurrencyController;
  let service: CurrencyService;
  const mockUser = UserStub.create();
  // const mockTransaction = TransactionStub.create();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CurrencyController],
      providers: [CurrencyService],
    }).compile();

    controller = module.get<CurrencyController>(CurrencyController);
    service = module.get<CurrencyService>(CurrencyService);
    jest.clearAllMocks();
  });

  describe('convert', () => {
    const convertDto = {
      amount: 200,
      fromCurrency: 'GBP',
      toCurrency: 'USD',
    };

    it('should successfully convert currency', async () => {
      const result = await controller.convert(convertDto, mockUser);
      const mockTransaction = TransactionStub.create();
      expect(service.convert).toHaveBeenCalledWith(convertDto, mockUser);
      expect(result).toEqual({
        success: true,
        data: mockTransaction,
      });
    });

    it('should handle conversion failure', async () => {
      jest
        .spyOn(service, 'convert')
        .mockRejectedValue(
          new BadRequestException('Currency conversion failed'),
        );

      await expect(controller.convert(convertDto, mockUser)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('getHistory', () => {
    it('should successfully return conversion history', async () => {
      const mockHistory = TransactionStub.createMany(3);

      const result = await controller.getHistory(mockUser);

      expect(service.getHistory).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual({
        success: true,
        data: mockHistory,
      });
    });

    it('should handle history fetch failure', async () => {
      jest
        .spyOn(service, 'getHistory')
        .mockRejectedValue(
          new BadRequestException('Failed to fetch conversion history'),
        );

      await expect(controller.getHistory(mockUser)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
