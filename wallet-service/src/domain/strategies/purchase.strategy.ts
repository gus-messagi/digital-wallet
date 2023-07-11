import { TransactionEntity } from '../entities/transaction.entity';
import { Strategy } from './interfaces/strategy.interface';
import { TransactionRepository } from '../repositories/transaction.repository';
import { CreateTransactionDTO } from '../dtos/transaction.dto';
import { Err, Ok, Result } from 'ts-results';
import { WalletService } from '../services/wallet.service';
import { Inject } from '@nestjs/common';
import { TransactionImplRepository } from 'src/infrastructure/data/repositories/transaction-impl.repository';

export class PurchaseStrategy implements Strategy {
  constructor(
    @Inject(TransactionImplRepository)
    private readonly transactionRepository: TransactionRepository,
    @Inject(WalletService)
    private readonly walletService: WalletService,
  ) {}

  async handle(
    transaction: TransactionEntity,
  ): Promise<Result<TransactionEntity, string>> {
    const currentBalance = await this.walletService.getBalance(
      transaction.userId,
    );

    if (transaction.amount > currentBalance) {
      return Err('Insufficient balance');
    }

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
