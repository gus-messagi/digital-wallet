import { Inject, Injectable } from '@nestjs/common';
import {
  GenerateStatementDTO,
  StatementDTO,
  StatementRecord,
} from '../dtos/statement.dto';
import {
  WALLET_SERVICE_NAME,
  WalletServiceClient,
} from 'src/infrastructure/protos/wallet.pb';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { StatementEntity } from '../entities/statement.entity';
import { StatementImplRepository } from 'src/infrastructure/data/repositories/statement-impl.repository';
import { StatementRepository } from '../repositories/statement.repository';
import { Operation } from '../enums/transaction.enum';
import { Err, Ok, Result } from 'ts-results';
import { FileService } from './file.service';
import { EmailService } from './email.service';

@Injectable()
export class StatementService {
  @Inject(WALLET_SERVICE_NAME)
  private readonly client: ClientGrpc;

  @Inject(StatementImplRepository)
  private readonly repository: StatementRepository;

  @Inject(FileService)
  private readonly fileService: FileService;

  @Inject(EmailService)
  private readonly emailService: EmailService;

  private calculateAmount(
    currentAmount: number,
    transactionAmount: number,
    operation: Operation,
  ) {
    if (operation === Operation.CANCELLATION) {
      return currentAmount;
    }

    if ([Operation.DEPOSIT, Operation.REVERSAL].includes(operation)) {
      return currentAmount + transactionAmount;
    }

    return currentAmount - transactionAmount;
  }

  async create(statement: StatementDTO) {
    const { balance } = await firstValueFrom(
      this.client
        .getService<WalletServiceClient>(WALLET_SERVICE_NAME)
        .balance({ userId: statement.userId }),
    );

    const userBalance = Number(balance.toFixed(2));
    const currentAmount = this.calculateAmount(
      userBalance,
      statement.transaction.amount,
      statement.transaction.operation,
    );

    const entity = StatementEntity.create({
      userId: statement.userId,
      transactionId: statement.transaction.id,
      lastAmount: userBalance,
      currentAmount,
    }).unwrap();

    await this.repository.create(entity);
  }

  async generate(
    filter: GenerateStatementDTO,
    throughEmail = false,
  ): Promise<Result<StatementRecord[], string[]>> {
    const { error, items } = await firstValueFrom(
      this.client
        .getService<WalletServiceClient>(WALLET_SERVICE_NAME)
        .getTransactions({
          userId: filter.userId,
          maxDate: filter.maxDate.toDateString(),
        }),
    );

    if (error) {
      return Err(error);
    }

    const mapIds = items.map(({ id }) => id);
    const statements = await this.repository.findManyByTransactionIds(mapIds);

    const formatted = statements.map((statement) => {
      const transaction = items.find(
        (item) => item.id === statement.transactionId,
      );

      return {
        amount: transaction.amount,
        balance: statement.currentAmount,
        operation: transaction.operation,
        date: transaction.createdAt,
      };
    });

    if (!throughEmail) return Ok(formatted);

    const content = this.fileService.create(formatted);

    const attachment = {
      filename: 'novotest.csv',
      content,
    };

    await this.emailService.send('gustavo.ramos.messagi@gmail.com', attachment);
  }
}
