import { Ok, Result } from 'ts-results';

interface StatementProps {
  id?: string;
  userId: string;
  transactionId: string;
  lastAmount: number;
  currentAmount: number;
}

export class StatementEntity implements StatementProps {
  id?: string;
  userId: string;
  transactionId: string;
  lastAmount: number;
  currentAmount: number;

  constructor(props: StatementProps) {
    Object.assign(this, props);
  }

  static create(transaction: StatementProps): Result<StatementEntity, string> {
    return new Ok(new StatementEntity(transaction));
  }
}
