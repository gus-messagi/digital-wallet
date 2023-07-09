import { TransactionEntity } from '../entities/transaction.entity';
import { Strategy } from './interfaces/strategy.interface';
import { TransactionRepository } from '../repositories/transaction.repository';
import { CreateTransactionDTO } from '../dtos/transaction.dto';
import { Err, Ok, Result } from 'ts-results';
import { WalletService } from '../services/wallet.service';

export class ReversalStrategy implements Strategy {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly walletService: WalletService,
  ) {}

  async handle(
    transaction: TransactionEntity,
  ): Promise<Result<TransactionEntity, string>> {
    const alreadyReversed = !!(await this.transactionRepository.findByParentId(
      transaction.parentId,
    ));

    if (alreadyReversed) {
      return Err('Transaction already reversed');
    }

    const transactionFound = await this.transactionRepository.findById(
      transaction.parentId,
    );

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
