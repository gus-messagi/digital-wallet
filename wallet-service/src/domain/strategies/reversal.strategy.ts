import { TransactionEntity } from '../entities/transaction.entity';
import { Strategy } from './interfaces/strategy.interface';
import { TransactionRepository } from '../repositories/transaction.repository';
import { CreateTransactionDTO } from '../dtos/transaction.dto';
import { Err, Ok, Result } from 'ts-results';
import { Inject } from '@nestjs/common';
import { TransactionImplRepository } from 'src/infrastructure/data/repositories/transaction-impl.repository';

export class ReversalStrategy implements Strategy {
  constructor(
    @Inject(TransactionImplRepository)
    private readonly transactionRepository: TransactionRepository,
  ) {}

  async handle(
    transaction: TransactionEntity,
  ): Promise<Result<TransactionEntity, string>> {
    const transactionIdToReverse = transaction.parentId;
    const alreadyReversed = !!(await this.transactionRepository.findByParentId(
      transactionIdToReverse,
    ));

    if (alreadyReversed) {
      return Err('Transaction already reversed');
    }

    const transactionFound = await this.transactionRepository.findById(
      transactionIdToReverse,
    );

    const mapToRepository: CreateTransactionDTO = {
      userId: transaction.userId,
      parentTransactionId: transactionIdToReverse,
      amount: transactionFound.amount,
      operation: transaction.operation,
      createdAt: transaction.createdAt,
    };

    const transactionCreated = await this.transactionRepository.create(
      mapToRepository,
    );

    return Ok(transactionCreated);
  }
}
