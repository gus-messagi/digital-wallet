import { StatementEntity } from '../entities/statement.entity';

export interface StatementRepository {
  create: (statement: StatementEntity) => Promise<StatementEntity>;
}
