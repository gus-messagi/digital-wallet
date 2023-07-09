import { Module } from '@nestjs/common';
import { PrismaConnector } from '../data/prisma';
import { StatementController } from 'src/presentation/controllers/statement.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { WALLET_SERVICE_NAME, WALLET_PACKAGE_NAME } from '../protos/wallet.pb';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { StatementService } from 'src/domain/services/statement.service';
import { StatementImplRepository } from '../data/repositories/statement-impl.repository';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: WALLET_SERVICE_NAME,
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            url: configService.get<string>('walletServiceUrl'),
            package: WALLET_PACKAGE_NAME,
            protoPath: 'node_modules/digital-wallet-proto/proto/wallet.proto',
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [PrismaConnector, StatementService, StatementImplRepository],
  controllers: [StatementController],
})
export class StatmentModule {}
