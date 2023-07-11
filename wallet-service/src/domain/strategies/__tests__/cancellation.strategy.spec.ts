import { TransactionImplRepository } from 'src/infrastructure/data/repositories/transaction-impl.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { TransactionEntity } from 'src/domain/entities/transaction.entity';
import { Operation } from 'src/domain/enums/transaction.enum';
import * as crypto from 'crypto';
import { CancellationStrategy } from '../cancellation.strategy';

describe('CancellationStrategy', () => {
  let cancellationStrategy: CancellationStrategy;

  const mockTransactions = [
    {
      id: 'transaction_id_to_be_cancelled',
      operation: Operation.PURCHASE,
      parentId: 'transaction_parent_id',
      userId: 'user_cancellation',
      amount: 10,
      createdAt: new Date(),
    },
    {
      id: 'transaction_deposit',
      operation: Operation.DEPOSIT,
      userId: 'user_cancellation',
      amount: 10,
      createdAt: new Date(),
    },
    {
      id: 'transaction_withdraw',
      operation: Operation.WITHDRAW,
      userId: 'user_cancellation',
      amount: 10,
      createdAt: new Date(),
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CancellationStrategy,
        {
          provide: TransactionImplRepository,
          useValue: {
            findById: jest.fn((transactionId) =>
              mockTransactions.find(({ id }) => transactionId === id),
            ),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    cancellationStrategy =
      module.get<CancellationStrategy>(CancellationStrategy);
  });

  it('should cancel successfuly', async () => {
    const userId = 'user_cancellation';
    const transaction = new TransactionEntity({
      userId,
      operation: Operation.CANCELLATION,
      parentId: 'transaction_id_to_be_cancelled',
    });

    jest
      .spyOn(cancellationStrategy['transactionRepository'], 'create')
      .mockImplementationOnce(async () => ({
        id: crypto.randomUUID(),
        userId,
        operation: Operation.CANCELLATION,
        parentId: 'transaction_id_to_be_cancelled',
        amount: 10,
      }));

    const result = await cancellationStrategy.handle(transaction);
    const cancelTransaction = result.unwrap();

    expect(cancelTransaction.id).toBeDefined();
    expect(cancelTransaction.amount).toBe(10);
    expect(cancelTransaction.operation).toBe(Operation.CANCELLATION);
    expect(cancelTransaction.userId).toBe(userId);
  });

  it('should not cancel because parent transaction is DEPOSIT', async () => {
    const userId = 'user_cancellation';
    const transaction = new TransactionEntity({
      userId,
      operation: Operation.CANCELLATION,
      parentId: 'transaction_deposit',
    });

    const result = await cancellationStrategy.handle(transaction);

    expect(result.err).toBe(true);
    expect(result.val).toBe('Transaction cannot be cancelled');
  });

  it('should not cancel because parent transaction is WITHDRAW', async () => {
    const userId = 'user_cancellation';
    const transaction = new TransactionEntity({
      userId,
      operation: Operation.CANCELLATION,
      parentId: 'transaction_withdraw',
    });

    const result = await cancellationStrategy.handle(transaction);

    expect(result.err).toBe(true);
    expect(result.val).toBe('Transaction cannot be cancelled');
  });
});
