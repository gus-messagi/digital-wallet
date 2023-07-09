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
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class TransactionService {
  @Inject('rabbitmq-module')
  private readonly client: ClientProxy;

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
    const result = await this.strategy.handle(transactionEntity);

    if (result.err) return result;

    const transactionCreated = result.unwrap();

    this.client.emit('transaction_created', {
      userId: transactionCreated.userId,
      transaction: {
        id: transactionCreated.id,
        amount: transactionCreated.amount,
        operation: transactionCreated.operation,
      },
    });

    return result;
  }
}
