import { Module } from '@nestjs/common';
import { TransactionController } from 'src/presentation/controllers/transaction.controller';
import { PrismaConnector } from '../data/prisma';
import { TransactionService } from 'src/domain/services/transaction.service';
import { DepositStrategy } from 'src/domain/strategies/deposit.strategy';
import { TransactionImplRepository } from '../data/repositories/transaction-impl.repository';
import { WalletService } from 'src/domain/services/wallet.service';

@Module({
  controllers: [TransactionController],
  providers: [
    PrismaConnector,
    TransactionService,
    DepositStrategy,
    TransactionImplRepository,
    WalletService,
  ],
})
export class TransactionModule {}
