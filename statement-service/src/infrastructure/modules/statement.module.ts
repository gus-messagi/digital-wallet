import { Module } from '@nestjs/common';
import { PrismaConnector } from '../data/prisma';
import { StatementController } from 'src/presentation/controllers/statement.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { WALLET_SERVICE_NAME, WALLET_PACKAGE_NAME } from '../protos/wallet.pb';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { StatementService } from 'src/domain/services/statement.service';
import { StatementImplRepository } from '../data/repositories/statement-impl.repository';
import { FileService } from 'src/domain/services/file.service';
import { EmailService } from 'src/domain/services/email.service';

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
  providers: [
    PrismaConnector,
    StatementService,
    StatementImplRepository,
    FileService,
    ConfigService,
    EmailService,
  ],
  controllers: [StatementController],
})
export class StatmentModule {}
