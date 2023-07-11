import { TransactionImplRepository } from 'src/infrastructure/data/repositories/transaction-impl.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { TransactionEntity } from 'src/domain/entities/transaction.entity';
import { Operation } from 'src/domain/enums/transaction.enum';
import * as crypto from 'crypto';
import { PurchaseStrategy } from '../purchase.strategy';
import { WalletService } from 'src/domain/services/wallet.service';

describe('PurchaseStrategy', () => {
  let purchaseStrategy: PurchaseStrategy;

  const balanceMocks = [
    {
      userId: 'user_purchase',
      balance: 15,
    },
    {
      userId: 'user_purchase_error',
      balance: 5,
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PurchaseStrategy,
        {
          provide: TransactionImplRepository,
          useValue: {
            create: jest.fn(() => ({
              id: crypto.randomUUID(),
              userId: 'user_purchase',
              operation: Operation.PURCHASE,
              amount: 10,
            })),
          },
        },
        {
          provide: WalletService,
          useValue: {
            getBalance: jest.fn(
              (userId) =>
                balanceMocks.find((mock) => mock.userId === userId).balance,
            ),
          },
        },
      ],
    }).compile();

    purchaseStrategy = module.get<PurchaseStrategy>(PurchaseStrategy);
  });

  it('should purchase successfuly', async () => {
    const userId = 'user_purchase';
    const transaction = new TransactionEntity({
      userId,
      operation: Operation.PURCHASE,
      amount: 10,
    });

    const result = await purchaseStrategy.handle(transaction);
    const cancelTransaction = result.unwrap();

    expect(cancelTransaction.id).toBeDefined();
    expect(cancelTransaction.amount).toBe(10);
    expect(cancelTransaction.operation).toBe(Operation.PURCHASE);
    expect(cancelTransaction.userId).toBe(userId);
  });

  it('should return err because insufficient balance', async () => {
    const userId = 'user_purchase_error';
    const transaction = new TransactionEntity({
      userId,
      operation: Operation.PURCHASE,
      amount: 10,
    });

    const result = await purchaseStrategy.handle(transaction);

    expect(result.err).toBe(true);
    expect(result.val).toBe('Insufficient balance');
  });
});
