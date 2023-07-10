import { Module } from '@nestjs/common';
import { AuthModule } from './infrastructure/modules/auth.module';
import { ConfigModule } from '@nestjs/config';
import { env } from './infrastructure/config/environment.config';
import { UserModule } from './infrastructure/modules/user.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    ConfigModule.forRoot({ isGlobal: true, load: [env] }),
  ],
})
export class AppModule {}
