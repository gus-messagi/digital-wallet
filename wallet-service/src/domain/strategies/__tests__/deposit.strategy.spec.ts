import { TransactionImplRepository } from 'src/infrastructure/data/repositories/transaction-impl.repository';
import { DepositStrategy } from '../deposit.strategy';
import { Test, TestingModule } from '@nestjs/testing';
import { TransactionEntity } from 'src/domain/entities/transaction.entity';
import { Operation } from 'src/domain/enums/transaction.enum';
import * as crypto from 'crypto';

describe('DepositStrategy', () => {
  let depositStrategy: DepositStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DepositStrategy,
        {
          provide: TransactionImplRepository,
          useValue: {
            create: jest.fn(() => ({
              id: crypto.randomUUID(),
              userId: 'user_deposit',
              operation: Operation.DEPOSIT,
              amount: 10,
            })),
          },
        },
      ],
    }).compile();

    depositStrategy = module.get<DepositStrategy>(DepositStrategy);
  });

  it('should deposit successfully', async () => {
    const transaction = new TransactionEntity({
      userId: 'user_deposit',
      operation: Operation.DEPOSIT,
      amount: 10,
    });

    const result = await depositStrategy.handle(transaction);
    const depositTransaction = result.unwrap();

    expect(depositTransaction.amount).toBe(10);
    expect(depositTransaction.operation).toBe(Operation.DEPOSIT);
    expect(depositTransaction.userId).toBe('user_deposit');
  });
});
