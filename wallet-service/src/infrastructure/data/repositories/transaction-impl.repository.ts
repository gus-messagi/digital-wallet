import { Inject, Injectable } from '@nestjs/common';
import { PrismaConnector } from '../prisma';
import {
  TransactionRepository,
  TransactionsBalanceGroupedByOperation,
} from 'src/domain/repositories/transaction.repository';
import { TransactionEntity } from 'src/domain/entities/transaction.entity';
import { CreateTransactionDTO } from 'src/domain/dtos/transaction.dto';
import { Operation } from 'src/domain/enums/transaction.enum';

@Injectable()
export class TransactionImplRepository implements TransactionRepository {
  @Inject(PrismaConnector)
  private readonly db: PrismaConnector;

  async create(transaction: CreateTransactionDTO): Promise<TransactionEntity> {
    const transactionCreated = await this.db.transaction.create({
      data: transaction,
    });

    return new TransactionEntity({
      ...transactionCreated,
      operation: Operation[transactionCreated.operation.toUpperCase()],
    });
  }

  async findById(id: string): Promise<TransactionEntity | null> {
    const trasactionFound = await this.db.transaction.findFirst({
      where: { id },
    });

    if (!trasactionFound) return null;

    return new TransactionEntity({
      ...trasactionFound,
      operation: Operation[trasactionFound.operation.toUpperCase()],
    });
  }

  async findByParentId(parentId: string): Promise<TransactionEntity | null> {
    const transactionFound = await this.db.transaction.findFirst({
      where: { parentTransactionId: parentId },
    });

    if (!transactionFound) return null;

    return new TransactionEntity({
      ...transactionFound,
      operation: Operation[transactionFound.operation.toUpperCase()],
    });
  }

  async findBalanceByUserId(
    userId: string,
  ): Promise<TransactionsBalanceGroupedByOperation[] | null> {
    const transactions = await this.db.transaction.groupBy({
      by: ['operation'],
      where: { userId },
      _sum: {
        amount: true,
      },
    });

    if (transactions.length === 0) return null;

    return transactions.map(({ _sum, operation }) => ({
      balance: _sum.amount,
      operation: Operation[operation.toUpperCase()],
    }));
  }
}
