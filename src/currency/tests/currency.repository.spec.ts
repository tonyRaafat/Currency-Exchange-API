import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { CurrencyRepository } from '../currency.repository';
import { CurrencyModel } from './support/currency.model';
import { Currency } from '../entities/currency.entity';
import { TransactionStub } from './stups/transaction.stup';

describe('CurrencyRepository', () => {
  let currencyRepository: CurrencyRepository;
  let currencyModel: CurrencyModel;
  const mockTransaction = TransactionStub.create();

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        CurrencyRepository,
        {
          provide: getModelToken(Currency.name),
          useClass: CurrencyModel,
        },
      ],
    }).compile();

    currencyRepository = moduleRef.get<CurrencyRepository>(CurrencyRepository);
    currencyModel = moduleRef.get<CurrencyModel>(getModelToken(Currency.name));
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('should find a currency by id', async () => {
      const spy = jest.spyOn(currencyModel, 'findById');
      await currencyRepository.findById('someId');
      expect(spy).toHaveBeenCalledWith('someId', undefined, undefined);
    });
  });

  describe('findOne', () => {
    it('should find one currency', async () => {
      const filterQuery = { code: 'USD' };
      const spy = jest.spyOn(currencyModel, 'findOne');
      await currencyRepository.findOne(filterQuery);
      expect(spy).toHaveBeenCalledWith(filterQuery, { __v: 0 });
    });
  });

  describe('find', () => {
    it('should find currencies', async () => {
      const filterQuery = { active: true };
      const spy = jest.spyOn(currencyModel, 'find');
      await currencyRepository.find(filterQuery);
      expect(spy).toHaveBeenCalledWith(filterQuery, undefined);
    });
  });

  describe('create', () => {
    it('should create a single currency', async () => {
      const spy = jest.spyOn(currencyModel, 'insertOne');
      await currencyRepository.create(mockTransaction);
      expect(spy).toHaveBeenCalledWith(mockTransaction);
    });

    it('should create multiple currencies', async () => {
      const currencies = [mockTransaction, mockTransaction];
      const spy = jest.spyOn(currencyModel, 'insertMany');
      await currencyRepository.create(currencies);
      expect(spy).toHaveBeenCalledWith(currencies);
    });
  });

  describe('findOneAndUpdate', () => {
    it('should find and update a currency', async () => {
      const filterQuery = { code: 'USD' };
      const update = { rate: 1.5 };
      const spy = jest.spyOn(currencyModel, 'findOneAndUpdate');
      await currencyRepository.findOneAndUpdate(filterQuery, update);
      expect(spy).toHaveBeenCalledWith(filterQuery, update, { new: true });
    });
  });

  describe('deleteMany', () => {
    it('should delete currencies', async () => {
      const filterQuery = { active: false };
      const spy = jest.spyOn(currencyModel, 'deleteMany');
      await currencyRepository.deleteMany(filterQuery);
      expect(spy).toHaveBeenCalledWith(filterQuery);
    });

    it('should delete all currencies when no filter provided', async () => {
      const spy = jest.spyOn(currencyModel, 'deleteMany');
      await currencyRepository.deleteMany();
      expect(spy).toHaveBeenCalledWith({});
    });
  });
});
