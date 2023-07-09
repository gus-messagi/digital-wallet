import { Test, TestingModule } from '@nestjs/testing';
import { WalletService } from './wallet.service';
import { TransactionImplRepository } from 'src/infrastructure/data/repositories/transaction-impl.repository';
import { Operation } from '../enums/transaction.enum';

describe('WalletService', () => {
  let walletService: WalletService;

  const balancesMock = [
    {
      userId: 'user_id_positive',
      result: [{ balance: 15.0, operation: Operation.DEPOSIT }],
    },
    {
      userId: 'user_id_zero_balance',
      result: [
        { balance: 15.0, operation: Operation.DEPOSIT },
        { balance: 15.0, operation: Operation.WITHDRAW },
      ],
    },
    {
      userId: 'user_id',
      result: [
        { balance: 40.0, operation: Operation.REVERSAL },
        { balance: 40.0, operation: Operation.CANCELLATION },
        { balance: 40.0, operation: Operation.PURCHASE },
        { balance: 15.0, operation: Operation.DEPOSIT },
        { balance: 30.0, operation: Operation.DEPOSIT },
        { balance: 15.0, operation: Operation.WITHDRAW },
        { balance: 15.0, operation: Operation.DEPOSIT },
      ],
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WalletService,
        {
          provide: TransactionImplRepository,
          useValue: {
            findBalanceByUserId: jest.fn(
              (userId) =>
                balancesMock.find(
                  (balanceMock) => balanceMock.userId === userId,
                ).result,
            ),
          },
        },
      ],
    }).compile();

    walletService = module.get<WalletService>(WalletService);
  });

  describe('balance', () => {
    it('should return positive balance', async () => {
      const userId = 'user_id_positive';
      const response = await walletService.getBalance(userId);

      expect(response).toBeGreaterThan(0);
    });

    it('should return zero balance', async () => {
      const userId = 'user_id_zero_balance';
      const response = await walletService.getBalance(userId);

      expect(response).toBe(0);
    });

    it('should return 45.0 of balance', async () => {
      const userId = 'user_id';
      const response = await walletService.getBalance(userId);

      expect(response).toBe(45.0);
    });
  });
});
