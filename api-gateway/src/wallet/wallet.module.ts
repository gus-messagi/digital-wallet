import { Global, Module } from '@nestjs/common';
import { WalletController } from './wallet.controller';
import { WALLET_PACKAGE_NAME, WALLET_SERVICE_NAME } from './wallet.pb';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Global()
@Module({
  imports: [
    ClientsModule.register([
      {
        name: WALLET_SERVICE_NAME,
        transport: Transport.GRPC,
        options: {
          url: '0.0.0.0:50052',
          package: WALLET_PACKAGE_NAME,
          protoPath: 'node_modules/digital-wallet-proto/proto/wallet.proto',
        },
      },
    ]),
  ],
  controllers: [WalletController],
})
export class WalletModule {}
