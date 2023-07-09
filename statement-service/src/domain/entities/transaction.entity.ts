import { Ok, Result } from 'ts-results';
import { Operation } from '../enums/transaction.enum';

interface TransactionProps {
  id?: string;
  userId: string;
  operation: Operation;
  amount?: number;
  createdAt?: Date;
  parentId?: string;
}

export class TransactionEntity implements TransactionProps {
  id?: string;
  userId: string;
  operation: Operation;
  amount?: number;
  createdAt?: Date;
  parentId?: string;

  constructor(props: TransactionProps) {
    Object.assign(this, props);
  }

  static create(
    transaction: TransactionProps,
  ): Result<TransactionEntity, string> {
    transaction.createdAt = new Date();

    return new Ok(new TransactionEntity(transaction));
  }
}
