import { Module } from '@nestjs/common';
import { PrismaConnector } from '../data/prisma';
import { TransactionImplRepository } from '../data/repositories/transaction-impl.repository';
import { WalletService } from 'src/domain/services/wallet.service';
import { WalletController } from 'src/presentation/controllers/wallet.controller';

@Module({
  controllers: [WalletController],
  providers: [PrismaConnector, TransactionImplRepository, WalletService],
})
export class WalletModule {}
