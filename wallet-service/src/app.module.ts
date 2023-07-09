import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { env } from './infrastructure/config/environment.config';
import { TransactionModule } from './infrastructure/modules/transaction.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [env] }),
    TransactionModule,
  ],
})
export class AppModule {}
