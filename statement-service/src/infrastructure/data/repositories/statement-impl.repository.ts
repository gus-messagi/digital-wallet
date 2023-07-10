import { Inject, Injectable } from '@nestjs/common';
import { StatementEntity } from 'src/domain/entities/statement.entity';
import { StatementRepository } from 'src/domain/repositories/statement.repository';
import { PrismaConnector } from '../prisma';

@Injectable()
export class StatementImplRepository implements StatementRepository {
  @Inject(PrismaConnector)
  private readonly db: PrismaConnector;

  async create(statement: StatementEntity): Promise<StatementEntity> {
    const statementCreated = await this.db.statement.create({
      data: statement,
    });

    return new StatementEntity(statementCreated);
  }

  async findManyByTransactionIds(
    transactionIds: string[],
  ): Promise<StatementEntity[]> {
    const statements = await this.db.statement.findMany({
      where: { transactionId: { in: transactionIds } },
    });

    if (statements.length === 0) return null;

    return statements.map((statement) => new StatementEntity(statement));
  }
}
