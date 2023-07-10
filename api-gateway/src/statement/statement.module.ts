import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  STATEMENT_PACKAGE_NAME,
  STATEMENT_SERVICE_NAME,
} from 'src/statement/statement.pb';
import { StatementController } from './statement.controller';

@Global()
@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: STATEMENT_SERVICE_NAME,
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            url: configService.get<string>('statementServiceUrl'),
            package: STATEMENT_PACKAGE_NAME,
            protoPath:
              'node_modules/digital-wallet-proto/proto/statement.proto',
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [StatementController],
})
export class StatementModule {}
