import { TransactionEntity } from '../entities/transaction.entity';
import { Strategy } from './interfaces/strategy.interface';
import { TransactionRepository } from '../repositories/transaction.repository';
import { CreateTransactionDTO } from '../dtos/transaction.dto';
import { Err, Ok, Result } from 'ts-results';
import { Operation } from '../enums/transaction.enum';

export class CancellationStrategy implements Strategy {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async handle(
    transaction: TransactionEntity,
  ): Promise<Result<TransactionEntity, string>> {
    const transactionFound = await this.transactionRepository.findById(
      transaction.parentId,
    );

    const cannotCancel = [Operation.DEPOSIT, Operation.WITHDRAW].includes(
      transactionFound.operation,
    );

    if (cannotCancel) {
      return new Err('Transaction cannot be cancelled');
    }

    const mapToRepository: CreateTransactionDTO = {
      userId: transaction.userId,
      parentTransactionId: transaction.parentId,
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
