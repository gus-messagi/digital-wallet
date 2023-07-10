import { StatementEntity } from '../entities/statement.entity';

export interface StatementRepository {
  create: (statement: StatementEntity) => Promise<StatementEntity>;
  findManyByTransactionIds: (
    transactionIds: string[],
  ) => Promise<StatementEntity[] | null>;
}
