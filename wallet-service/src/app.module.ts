import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { environment } from './infrastructure/config/environment.config';
import { TransactionModule } from './infrastructure/modules/transaction.module';
import { WalletModule } from './infrastructure/modules/wallet.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [environment] }),
    TransactionModule,
    WalletModule,
  ],
})
export class AppModule {}
