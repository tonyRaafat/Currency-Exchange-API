import { Currency } from '../../../currency/entities/currency.entity';
import { MockModel } from '../../../database/test/mock.model';
import { TransactionStub } from '../stups/transaction.stup';

export class CurrencyModel extends MockModel<Currency> {
  protected entityStub = TransactionStub.create();
}
