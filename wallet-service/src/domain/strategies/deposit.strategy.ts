import { TransactionEntity } from '../entities/transaction.entity';
import { Strategy } from './interfaces/strategy.interface';
import { TransactionRepository } from '../repositories/transaction.repository';
import { CreateTransactionDTO } from '../dtos/transaction.dto';
import { Ok, Result } from 'ts-results';

export class DepositStrategy implements Strategy {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async handle(
    transaction: TransactionEntity,
  ): Promise<Result<TransactionEntity, string>> {
    const mapToRepository: CreateTransactionDTO = {
      ...transaction,
      amount: transaction.amount,
      createdAt: transaction.createdAt,
    };

    const transactionCreated = await this.transactionRepository.create(
      mapToRepository,
    );

    return Ok(transactionCreated);
  }
}
