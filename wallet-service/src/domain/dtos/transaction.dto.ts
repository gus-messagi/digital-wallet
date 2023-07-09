import { Operation } from '../enums/transaction.enum';

export interface TransactionDTO {
  id?: string;
  userId: string;
  amount?: number;
  operation: Operation;
  parentId?: string;
}

export interface CreateTransactionDTO {
  id?: string;
  userId: string;
  amount: number;
  operation: Operation;
  parentTransactionId?: string;
  createdAt: Date;
}
