import { Operation } from '../enums/transaction.enum';

export interface StatementDTO {
  userId: string;
  transaction: {
    id: string;
    amount: number;
    operation: Operation;
  };
}

export interface GenerateStatementDTO {
  userId: string;
  maxDate: Date;
}

export interface StatementRecord {
  amount: number;
  balance: number;
  operation: string;
  date: string;
}
