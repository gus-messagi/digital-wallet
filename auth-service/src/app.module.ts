import { Module } from '@nestjs/common';
import { AuthModule } from './infrastructure/modules/auth.module';
import { ConfigModule } from '@nestjs/config';
import { env } from './infrastructure/config/environment.config';

@Module({
  imports: [AuthModule, ConfigModule.forRoot({ isGlobal: true, load: [env] })],
})
export class AppModule {}
