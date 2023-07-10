import { CreateTransactionDTO } from '../dtos/transaction.dto';
import { TransactionEntity } from '../entities/transaction.entity';
import { Operation } from '../enums/transaction.enum';

export interface TransactionsBalanceGroupedByOperation {
  balance: number;
  operation: Operation;
}

export interface TransactionRepository {
  create: (transaction: CreateTransactionDTO) => Promise<TransactionEntity>;
  findById: (id: string) => Promise<TransactionEntity | null>;
  findBalanceByUserId: (
    userId: string,
  ) => Promise<TransactionsBalanceGroupedByOperation[]>;
  findByParentId: (parentId: string) => Promise<TransactionEntity | null>;
  findByUserIdAndFilter: (
    userId: string,
    maxDate: Date,
  ) => Promise<TransactionEntity[] | null>;
}
