import { Global, Module } from '@nestjs/common';
import { WalletController } from './wallet.controller';
import { WALLET_PACKAGE_NAME, WALLET_SERVICE_NAME } from './wallet.pb';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
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
  controllers: [WalletController],
})
export class WalletModule {}
