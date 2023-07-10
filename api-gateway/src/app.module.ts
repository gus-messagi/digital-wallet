import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { WalletModule } from './wallet/wallet.module';
import { ConfigModule } from '@nestjs/config';
import { environment } from './config/env.config';
import { StatementModule } from './statement/statement.module';

@Module({
  imports: [
    AuthModule,
    WalletModule,
    StatementModule,
    ConfigModule.forRoot({ isGlobal: true, load: [environment] }),
  ],
})
export class AppModule {}
