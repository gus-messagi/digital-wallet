import { Operation } from '../enums/transaction.enum';

export interface StatementDTO {
  userId: string;
  transaction: {
    id: string;
    amount: number;
    operation: Operation;
  };
}
