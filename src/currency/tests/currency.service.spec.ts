import { Test, TestingModule } from '@nestjs/testing';
import { CurrencyService } from '../currency.service';
import { ConfigService } from '@nestjs/config';
import { CurrencyRepository } from '../currency.repository';
import { UserStub } from '../../users/tests/stups/user.stup';
import { TransactionStub } from './stups/transaction.stup';
import { BadRequestException } from '@nestjs/common';
import axios from 'axios';
import {
  TEST_CONVERSION_RESPONSE,
  TEST_ERROR_RESPONSE,
} from './constants/test-constants';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('CurrencyService', () => {
  let service: CurrencyService;
  let repository: CurrencyRepository;
  const mockUser = UserStub.create();
  const mockTransaction = TransactionStub.create();

  const mockConfigService = {
    getOrThrow: jest.fn().mockReturnValue('mock-api-key'),
  };

  const mockRepository = {
    create: jest.fn(),
    find: jest.fn().mockReturnThis(),
    sort: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CurrencyService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: CurrencyRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CurrencyService>(CurrencyService);
    repository = module.get<CurrencyRepository>(CurrencyRepository);
    jest.clearAllMocks();
  });

  describe('convert', () => {
    const convertDto = {
      amount: 100,
      fromCurrency: 'USD',
      toCurrency: 'EUR',
    };

    it('should successfully convert currency', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: TEST_CONVERSION_RESPONSE });
      mockRepository.create.mockResolvedValueOnce(mockTransaction);

      const result = await service.convert(convertDto, mockUser);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining(
          `/pair/${convertDto.fromCurrency}/${convertDto.toCurrency}/${convertDto.amount}`,
        ),
      );
      expect(mockRepository.create).toHaveBeenCalled();
      expect(result.success).toBeTruthy();
      expect(result.data).toBeDefined();
    });

    it('should handle API error response', async () => {
      mockedAxios.get.mockRejectedValueOnce({
        response: { data: TEST_ERROR_RESPONSE },
      });

      await expect(service.convert(convertDto, mockUser)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('getHistory', () => {
    it('should return conversion history', async () => {
      const mockHistory = TransactionStub.createMany(3);
      mockRepository.sort.mockResolvedValueOnce(mockHistory);

      const result = await service.getHistory(mockUser);

      expect(mockRepository.find).toHaveBeenCalledWith({
        userId: mockUser._id,
      });
      expect(mockRepository.sort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(result.success).toBeTruthy();
      expect(result.data).toEqual(mockHistory);
    });

    it('should handle database error', async () => {
      mockRepository.sort.mockRejectedValueOnce(new Error('Database error'));

      await expect(service.getHistory(mockUser)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
