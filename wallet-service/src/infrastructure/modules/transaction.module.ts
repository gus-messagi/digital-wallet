import { Module } from '@nestjs/common';
import { TransactionController } from 'src/presentation/controllers/transaction.controller';
import { PrismaConnector } from '../data/prisma';
import { TransactionService } from 'src/domain/services/transaction.service';
import { TransactionImplRepository } from '../data/repositories/transaction-impl.repository';
import { WalletService } from 'src/domain/services/wallet.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        imports: [ConfigModule],
        name: 'rabbitmq-module',
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('rabbitmqUrl')],
            queue: configService.get<string>('statementQueue'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [TransactionController],
  providers: [
    PrismaConnector,
    TransactionService,
    TransactionImplRepository,
    WalletService,
  ],
})
export class TransactionModule {}
