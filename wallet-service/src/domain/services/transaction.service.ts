import { Inject, Injectable } from '@nestjs/common';
import { TransactionDTO } from '../dtos/transaction.dto';
import { TransactionEntity } from '../entities/transaction.entity';
import { Operation } from '../enums/transaction.enum';
import { Strategy } from '../strategies/interfaces/strategy.interface';
import { DepositStrategy } from '../strategies/deposit.strategy';
import { TransactionImplRepository } from 'src/infrastructure/data/repositories/transaction-impl.repository';
import { TransactionRepository } from '../repositories/transaction.repository';
import { WithdrawStrategy } from '../strategies/withdraw.strategy';
import { PurchaseStrategy } from '../strategies/purchase.strategy';
import { Result } from 'ts-results';
import { CancellationStrategy } from '../strategies/cancellation.strategy';
import { WalletService } from './wallet.service';
import { ReversalStrategy } from '../strategies/reversal.strategy';

@Injectable()
export class TransactionService {
  @Inject(TransactionImplRepository)
  private readonly repository: TransactionRepository;

  @Inject(WalletService)
  private readonly walletService: WalletService;

  private strategy: Strategy;

  private setStrategy(strategy: Strategy) {
    this.strategy = strategy;
  }

  async operation(
    transaction: TransactionDTO,
  ): Promise<Result<TransactionEntity, string>> {
    const entityResult = TransactionEntity.create(transaction);
    const transactionEntity = entityResult.unwrap();

    const resolvers = {
      [Operation.DEPOSIT]: DepositStrategy,
      [Operation.WITHDRAW]: WithdrawStrategy,
      [Operation.PURCHASE]: PurchaseStrategy,
      [Operation.CANCELLATION]: CancellationStrategy,
      [Operation.REVERSAL]: ReversalStrategy,
    };

    const resolver = new resolvers[transactionEntity.operation](
      this.repository,
      this.walletService,
    );

    this.setStrategy(resolver);

    return await this.strategy.handle(transactionEntity);
  }
}
