import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { env } from './infrastructure/config/environment.config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, load: [env] })],
})
export class AppModule {}
