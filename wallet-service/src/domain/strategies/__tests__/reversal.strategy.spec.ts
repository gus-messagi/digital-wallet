import { TransactionImplRepository } from 'src/infrastructure/data/repositories/transaction-impl.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { TransactionEntity } from 'src/domain/entities/transaction.entity';
import { Operation } from 'src/domain/enums/transaction.enum';
import * as crypto from 'crypto';
import { ReversalStrategy } from '../reversal.strategy';

describe('ReversalStrategy', () => {
  let reversalStrategy: ReversalStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReversalStrategy,
        {
          provide: TransactionImplRepository,
          useValue: {
            create: jest.fn(() => ({
              id: crypto.randomUUID(),
              userId: 'user_reversal',
              operation: Operation.REVERSAL,
              amount: 10,
            })),
            findByParentId: jest.fn((id) =>
              id === 'transaction_reversed'
                ? { id: 'transaction_reversed' }
                : null,
            ),
            findById: jest.fn(() => ({
              id: 'transaction_reverse_success',
              amount: 10,
              userId: 'user_reversal',
              operation: Operation.CANCELLATION,
            })),
          },
        },
      ],
    }).compile();

    reversalStrategy = module.get<ReversalStrategy>(ReversalStrategy);
  });

  it('should reverse transaction successfuly', async () => {
    const userId = 'user_reversal';
    const transaction = new TransactionEntity({
      userId,
      operation: Operation.REVERSAL,
      parentId: 'transaction_reverse_success',
    });

    const result = await reversalStrategy.handle(transaction);
    const cancelTransaction = result.unwrap();

    expect(cancelTransaction.id).toBeDefined();
    expect(cancelTransaction.amount).toBe(10);
    expect(cancelTransaction.operation).toBe(Operation.REVERSAL);
    expect(cancelTransaction.userId).toBe(userId);
  });

  it('should return error because transaction already reversed', async () => {
    const userId = 'user_reversal';
    const transaction = new TransactionEntity({
      userId,
      operation: Operation.REVERSAL,
      parentId: 'transaction_reversed',
    });

    const result = await reversalStrategy.handle(transaction);

    expect(result.err).toBe(true);
    expect(result.val).toBe('Transaction already reversed');
  });
});
