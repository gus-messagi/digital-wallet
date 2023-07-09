import { Inject } from '@nestjs/common';
import { TransactionImplRepository } from 'src/infrastructure/data/repositories/transaction-impl.repository';
import { TransactionRepository } from '../repositories/transaction.repository';
import { Operation } from '../enums/transaction.enum';

export class WalletService {
  @Inject(TransactionImplRepository)
  private readonly transactionRepository: TransactionRepository;

  async getBalance(userId: string): Promise<number> {
    const transactions = await this.transactionRepository.findBalanceByUserId(
      userId,
    );

    if (!transactions) return 0;

    const balance = transactions.reduce((acc, cur) => {
      if (cur.operation === Operation.CANCELLATION) return acc;

      if ([Operation.DEPOSIT, Operation.REVERSAL].includes(cur.operation)) {
        acc += cur.balance;

        return acc;
      }

      acc -= cur.balance;

      return acc;
    }, 0);

    return balance;
  }
}
