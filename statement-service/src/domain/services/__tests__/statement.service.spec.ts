import { Test, TestingModule } from '@nestjs/testing';
import { StatementService } from '../statement.service';
import { Operation } from 'src/domain/enums/transaction.enum';
import { WALLET_SERVICE_NAME } from 'src/infrastructure/protos/wallet.pb';
import { AUTH_SERVICE_NAME } from 'src/infrastructure/protos/auth.pb';
import { EventImplRepository } from 'src/infrastructure/data/repositories/event-impl.repository';
import { FileService } from '../file.service';
import { EmailService } from '../email.service';
import { StatementImplRepository } from 'src/infrastructure/data/repositories/statement-impl.repository';
import { of } from 'rxjs';
import * as crypto from 'crypto';
import { StatementEntity } from 'src/domain/entities/statement.entity';

describe('StatementService', () => {
  let statementService: StatementService;

  const userId = 'user_id_generate_data';
  const transactionsMock = [
    {
      id: crypto.randomUUID(),
      amount: 10,
      operation: Operation.DEPOSIT,
      createdAt: new Date('2023-07-08'),
      userId,
    },
    {
      id: crypto.randomUUID(),
      amount: 5,
      operation: Operation.WITHDRAW,
      createdAt: new Date('2023-07-10'),
      userId,
    },
    {
      id: crypto.randomUUID(),
      amount: 20,
      operation: Operation.DEPOSIT,
      createdAt: new Date('2023-07-09'),
      userId,
    },
  ];

  const statementsMock = [
    {
      id: crypto.randomUUID(),
      transactionId: transactionsMock[0].id,
      lastAmount: 0,
      currentAmount: 10,
      userId,
    },
    {
      id: crypto.randomUUID(),
      transactionId: transactionsMock[1].id,
      lastAmount: 10,
      currentAmount: 20,
      userId,
    },
    {
      id: crypto.randomUUID(),
      transactionId: transactionsMock[2].id,
      lastAmount: 0,
      currentAmount: 10,
      userId,
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatementService,
        {
          provide: WALLET_SERVICE_NAME,
          useValue: {
            getService: jest.fn(() => ({
              balance: jest.fn(() => of({ balance: 10 })),
              getTransactions: jest.fn(() => of({ items: transactionsMock })),
            })),
          },
        },
        {
          provide: AUTH_SERVICE_NAME,
          useValue: jest.fn(),
        },
        {
          provide: EventImplRepository,
          useValue: {
            create: jest.fn(),
            existsEvent: jest.fn(),
          },
        },
        {
          provide: FileService,
          useValue: jest.fn(),
        },
        {
          provide: EmailService,
          useValue: jest.fn(),
        },
        {
          provide: StatementImplRepository,
          useValue: {
            create: jest.fn(),
            findManyByTransactionIds: jest.fn(() => statementsMock),
          },
        },
      ],
    }).compile();

    statementService = module.get<StatementService>(StatementService);
  });

  describe('create', () => {
    it('should create statement from deposit transaction', async () => {
      const userId = 'user_deposit';
      const transactionId = 'deposit_transaction';
      const currentAmount = 10;
      const lastAmount = 0;

      const statement = {
        userId,
        transaction: {
          id: transactionId,
          operation: Operation.DEPOSIT,
          amount: 10,
        },
      };

      const eventId = null;
      const entity = new StatementEntity({
        userId,
        transactionId,
        currentAmount,
        lastAmount,
      });

      const repositorySpyOn = jest.spyOn(
        statementService['repository'],
        'create',
      );

      repositorySpyOn.mockImplementationOnce(async () => ({
        userId,
        transactionId,
        currentAmount,
        lastAmount,
        id: crypto.randomUUID(),
      }));

      await statementService.create(statement, eventId);

      expect(repositorySpyOn).toHaveBeenCalledWith(entity);
    });

    it('should create statement from withdraw transaction', async () => {
      const userId = 'user_withdraw';
      const transactionId = 'withdraw_transaction';
      const currentAmount = 10;
      const lastAmount = 20;

      const statement = {
        userId,
        transaction: {
          id: transactionId,
          operation: Operation.WITHDRAW,
          amount: 10,
        },
      };

      const eventId = null;
      const entity = new StatementEntity({
        userId,
        transactionId,
        currentAmount,
        lastAmount,
      });

      const repositorySpyOn = jest.spyOn(
        statementService['repository'],
        'create',
      );

      repositorySpyOn.mockImplementationOnce(async () => ({
        userId,
        transactionId,
        currentAmount,
        lastAmount,
        id: crypto.randomUUID(),
      }));

      await statementService.create(statement, eventId);

      expect(repositorySpyOn).toHaveBeenCalledWith(entity);
    });

    it('should create statement from cancellation transaction', async () => {
      const userId = 'user_cancellation';
      const transactionId = 'cancellation_transaction';
      const currentAmount = 10;
      const lastAmount = 10;

      const statement = {
        userId,
        transaction: {
          id: transactionId,
          operation: Operation.CANCELLATION,
          amount: 10,
        },
      };

      const eventId = null;
      const entity = new StatementEntity({
        userId,
        transactionId,
        currentAmount,
        lastAmount,
      });

      const repositorySpyOn = jest.spyOn(
        statementService['repository'],
        'create',
      );

      repositorySpyOn.mockImplementationOnce(async () => ({
        userId,
        transactionId,
        currentAmount,
        lastAmount,
        id: crypto.randomUUID(),
      }));

      await statementService.create(statement, eventId);

      expect(repositorySpyOn).toHaveBeenCalledWith(entity);
    });

    it('should create statement from reversal transaction', async () => {
      const userId = 'user_reversal';
      const transactionId = 'reversal_transaction';
      const currentAmount = 10;
      const lastAmount = 0;

      const statement = {
        userId,
        transaction: {
          id: transactionId,
          operation: Operation.REVERSAL,
          amount: 10,
        },
      };

      const eventId = null;
      const entity = new StatementEntity({
        userId,
        transactionId,
        currentAmount,
        lastAmount,
      });

      const repositorySpyOn = jest.spyOn(
        statementService['repository'],
        'create',
      );

      repositorySpyOn.mockImplementationOnce(async () => ({
        userId,
        transactionId,
        currentAmount,
        lastAmount,
        id: crypto.randomUUID(),
      }));

      await statementService.create(statement, eventId);

      expect(repositorySpyOn).toHaveBeenCalledWith(entity);
    });

    it('should create statement from purchase transaction', async () => {
      const userId = 'user_purchase';
      const transactionId = 'purchase_transaction';
      const currentAmount = 10;
      const lastAmount = 20;

      const statement = {
        userId,
        transaction: {
          id: transactionId,
          operation: Operation.PURCHASE,
          amount: 10,
        },
      };

      const eventId = null;
      const entity = new StatementEntity({
        userId,
        transactionId,
        currentAmount,
        lastAmount,
      });

      const repositorySpyOn = jest.spyOn(
        statementService['repository'],
        'create',
      );

      repositorySpyOn.mockImplementationOnce(async () => ({
        userId,
        transactionId,
        currentAmount,
        lastAmount,
        id: crypto.randomUUID(),
      }));

      await statementService.create(statement, eventId);

      expect(repositorySpyOn).toHaveBeenCalledWith(entity);
    });

    it('should call event creation', async () => {
      const userId = 'user_event_id';
      const transactionId = 'event_transaction';
      const currentAmount = 10;
      const lastAmount = 0;

      const statement = {
        userId,
        transaction: {
          id: transactionId,
          operation: Operation.DEPOSIT,
          amount: 10,
        },
      };

      const eventId = 'event_id';

      const eventRepositorySpyOn = jest.spyOn(
        statementService['eventRepository'],
        'create',
      );

      const statementId = crypto.randomUUID();

      jest
        .spyOn(statementService['repository'], 'create')
        .mockImplementationOnce(async () => ({
          userId,
          transactionId,
          currentAmount,
          lastAmount,
          id: statementId,
        }));

      await statementService.create(statement, eventId);

      expect(eventRepositorySpyOn).toHaveBeenCalledWith(eventId, statementId);
    });

    it('should return duplicate event', async () => {
      const userId = 'user_event_id';
      const transactionId = 'event_transaction';

      const statement = {
        userId,
        transaction: {
          id: transactionId,
          operation: Operation.DEPOSIT,
          amount: 10,
        },
      };

      const eventId = 'event_id';

      const eventRepositorySpyOn = jest.spyOn(
        statementService['eventRepository'],
        'existsEvent',
      );

      eventRepositorySpyOn.mockImplementationOnce(async () => true);

      const result = await statementService.create(statement, eventId);

      expect(eventRepositorySpyOn).toHaveBeenCalledWith(eventId);
      expect(result.err).toBe(true);
      expect(result.val).toBe('Event duplicated');
    });
  });

  describe('generateData', () => {
    it('should generate successfully', async () => {
      const maxDate = new Date('2023-07-08');

      const result = await statementService.generateData({
        userId,
        maxDate,
      });

      const statements = result.unwrap();

      expect(statements.length).toBe(3);
      expect(statements).toStrictEqual(
        [...statements].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        ),
      );
    });
  });
});
