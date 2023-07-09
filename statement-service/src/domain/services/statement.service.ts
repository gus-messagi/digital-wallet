import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { StatementDTO } from '../dtos/statement.dto';
import {
  WALLET_SERVICE_NAME,
  WalletServiceClient,
} from 'src/infrastructure/protos/wallet.pb';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { StatementEntity } from '../entities/statement.entity';
import { StatementImplRepository } from 'src/infrastructure/data/repositories/statement-impl.repository';
import { StatementRepository } from '../repositories/statement.repository';

@Injectable()
export class StatementService implements OnModuleInit {
  private walletService: WalletServiceClient;

  @Inject(WALLET_SERVICE_NAME)
  private readonly client: ClientGrpc;

  @Inject(StatementImplRepository)
  private readonly repository: StatementRepository;

  public onModuleInit(): void {
    this.walletService =
      this.client.getService<WalletServiceClient>(WALLET_SERVICE_NAME);
  }

  async create(statement: StatementDTO) {
    const { balance } = await firstValueFrom(
      this.walletService.balance({ userId: statement.userId }),
    );

    const userBalance = Number(balance.toFixed(2));
    const currentBalance = userBalance - statement.transaction.amount;

    const entity = StatementEntity.create({
      userId: statement.userId,
      transactionId: statement.transaction.id,
      lastAmount: userBalance,
      currentAmount: currentBalance,
    }).unwrap();

    await this.repository.create(entity);
  }
}
