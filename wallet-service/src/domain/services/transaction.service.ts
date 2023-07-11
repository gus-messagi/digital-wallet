import { Inject, Injectable } from '@nestjs/common';
import { GetTransactionsDTO, TransactionDTO } from '../dtos/transaction.dto';
import { TransactionEntity } from '../entities/transaction.entity';
import { Operation } from '../enums/transaction.enum';
import { Strategy } from '../strategies/interfaces/strategy.interface';
import { DepositStrategy } from '../strategies/deposit.strategy';
import { TransactionImplRepository } from 'src/infrastructure/data/repositories/transaction-impl.repository';
import { TransactionRepository } from '../repositories/transaction.repository';
import { WithdrawStrategy } from '../strategies/withdraw.strategy';
import { PurchaseStrategy } from '../strategies/purchase.strategy';
import { Err, Ok, Result } from 'ts-results';
import { CancellationStrategy } from '../strategies/cancellation.strategy';
import { WalletService } from './wallet.service';
import { ReversalStrategy } from '../strategies/reversal.strategy';
import { ClientProxy, RmqRecordBuilder } from '@nestjs/microservices';
import * as crypto from 'crypto';
import { EventImplRepository } from 'src/infrastructure/data/repositories/event-impl.repository';
import { EventRepository } from '../repositories/event.repository';

@Injectable()
export class TransactionService {
  @Inject('rabbitmq-module')
  private readonly client: ClientProxy;

  @Inject(TransactionImplRepository)
  private readonly repository: TransactionRepository;

  @Inject(EventImplRepository)
  private readonly eventRepository: EventRepository;

  @Inject(WalletService)
  private readonly walletService: WalletService;

  private strategy: Strategy;

  private setStrategy(strategy: Strategy) {
    this.strategy = strategy;
  }

  private emitTransactionCreatedEvent(transaction: TransactionEntity) {
    const data = {
      userId: transaction.userId,
      transaction: {
        id: transaction.id,
        amount: transaction.amount,
        operation: transaction.operation,
      },
    };

    const record = new RmqRecordBuilder(data)
      .setOptions({ messageId: crypto.randomUUID() })
      .build();

    this.client.emit('transaction_created', record);
  }

  async operation(
    transaction: TransactionDTO,
    eventId?: string,
  ): Promise<Result<TransactionEntity, string>> {
    if (eventId) {
      const existsEvent = await this.eventRepository.existsEvent(eventId);

      if (existsEvent) return Err('Evento duplicado');
    }

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

    if (eventId) {
      await this.eventRepository.create(eventId, transactionCreated.id);
    }

    this.emitTransactionCreatedEvent(transactionCreated);

    return result;
  }

  async getTransactions(
    filter: GetTransactionsDTO,
  ): Promise<Result<TransactionEntity[], string>> {
    const transactions = await this.repository.findByUserIdAndFilter(
      filter.userId,
      filter.maxDate,
    );

    if (!transactions) {
      return Err('No transactions');
    }

    return Ok(transactions);
  }
}
