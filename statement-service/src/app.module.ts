import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { environment } from './infrastructure/config/environment.config';
import { StatmentModule } from './infrastructure/modules/statement.module';

@Module({
  imports: [
    StatmentModule,
    ConfigModule.forRoot({ isGlobal: true, load: [environment] }),
  ],
})
export class AppModule {}
