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
  amount: string;
  balance: string;
  operation: string;
  date: string;
}
