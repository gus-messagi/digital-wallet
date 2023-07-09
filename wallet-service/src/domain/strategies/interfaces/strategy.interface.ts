import { TransactionEntity } from 'src/domain/entities/transaction.entity';
import { Result } from 'ts-results';

export interface Strategy {
  handle: (data: object) => Promise<Result<TransactionEntity, string>>;
}
