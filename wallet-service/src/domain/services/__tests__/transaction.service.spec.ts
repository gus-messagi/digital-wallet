import { Test, TestingModule } from '@nestjs/testing';
import { TransactionImplRepository } from 'src/infrastructure/data/repositories/transaction-impl.repository';
import { Operation } from '../../enums/transaction.enum';
import { TransactionService } from '../transaction.service';
import { WalletService } from '../wallet.service';
import { DepositStrategy } from '../../strategies/deposit.strategy';
import { WithdrawStrategy } from '../../strategies/withdraw.strategy';
import { PurchaseStrategy } from '../../strategies/purchase.strategy';
import { ReversalStrategy } from '../../strategies/reversal.strategy';
import { CreateTransactionDTO } from '../../dtos/transaction.dto';
import { CancellationStrategy } from '../../strategies/cancellation.strategy';
import { EventImplRepository } from 'src/infrastructure/data/repositories/event-impl.repository';

jest.mock('../../strategies/deposit.strategy', () => ({
  DepositStrategy: jest.fn().mockImplementationOnce(() => ({
    handle: jest.fn(() => ({
      unwrap: jest.fn(() => ({
        id: 'transaction_id',
        userId: 'user_id',
        amount: 10,
      })),
    })),
  })),
}));

jest.mock('../../strategies/withdraw.strategy', () => ({
  WithdrawStrategy: jest.fn().mockImplementationOnce(() => ({
    handle: jest.fn(() => ({
      unwrap: jest.fn(() => ({
        id: 'transaction_id',
        userId: 'user_id',
        amount: 10,
      })),
    })),
  })),
}));

jest.mock('../../strategies/purchase.strategy', () => ({
  PurchaseStrategy: jest.fn().mockImplementationOnce(() => ({
    handle: jest.fn(() => ({
      unwrap: jest.fn(() => ({
        id: 'transaction_id',
        userId: 'user_id',
        amount: 10,
      })),
    })),
  })),
}));

jest.mock('../../strategies/cancellation.strategy', () => ({
  CancellationStrategy: jest.fn().mockImplementationOnce(() => ({
    handle: jest.fn(() => ({
      unwrap: jest.fn(() => ({
        id: 'transaction_id',
        userId: 'user_id',
        amount: 10,
      })),
    })),
  })),
}));

jest.mock('../../strategies/reversal.strategy', () => ({
  ReversalStrategy: jest.fn().mockImplementationOnce(() => ({
    handle: jest.fn(() => ({
      unwrap: jest.fn(() => ({
        id: 'transaction_id',
        userId: 'user_id',
        amount: 10,
      })),
    })),
  })),
}));

describe('TransactionService', () => {
  let transactionService: TransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: 'rabbitmq-module',
          useValue: {
            emit: jest.fn(),
          },
        },
        {
          provide: WalletService,
          useValue: {
            getBalance: jest.fn(),
          },
        },
        {
          provide: TransactionImplRepository,
          useValue: {
            create: jest.fn(),
            findBalanceByUserId: jest.fn(),
          },
        },
        {
          provide: EventImplRepository,
          useValue: {
            existsEvent: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    transactionService = module.get<TransactionService>(TransactionService);
  });

  it('should call deposit strategy succesfully', async () => {
    const transaction = {
      operation: Operation.DEPOSIT,
    } as CreateTransactionDTO;

    await transactionService.operation(transaction);

    expect(DepositStrategy).toHaveBeenCalled();
    expect(transactionService['strategy'].handle).toHaveBeenCalled();
  });

  it('should withdraw deposit strategy succesfully', async () => {
    const transaction = {
      operation: Operation.WITHDRAW,
    } as CreateTransactionDTO;

    await transactionService.operation(transaction);

    expect(WithdrawStrategy).toHaveBeenCalled();
    expect(transactionService['strategy'].handle).toHaveBeenCalled();
  });

  it('should call purchase strategy succesfully', async () => {
    const transaction = {
      operation: Operation.PURCHASE,
    } as CreateTransactionDTO;

    await transactionService.operation(transaction);

    expect(PurchaseStrategy).toHaveBeenCalled();
    expect(transactionService['strategy'].handle).toHaveBeenCalled();
  });

  it('should call reversal strategy succesfully', async () => {
    const transaction = {
      operation: Operation.REVERSAL,
    } as CreateTransactionDTO;

    await transactionService.operation(transaction);

    expect(ReversalStrategy).toHaveBeenCalled();
    expect(transactionService['strategy'].handle).toHaveBeenCalled();
  });

  it('should call cancellation strategy succesfully', async () => {
    const transaction = {
      operation: Operation.CANCELLATION,
    } as CreateTransactionDTO;

    await transactionService.operation(transaction);

    expect(CancellationStrategy).toHaveBeenCalled();
    expect(transactionService['strategy'].handle).toHaveBeenCalled();
  });
});
