import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from 'src/domain/services/auth.service';
import { AuthController } from 'src/presentation/controllers/auth.controller';
import { UserImplRepository } from '../data/repositories/user-impl.repository';
import { PrismaConnector } from '../data/prisma';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (service: ConfigService) => ({
        secret: service.get<string>('secret'),
        signOptions: { expiresIn: '8h' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserImplRepository, PrismaConnector],
})
export class AuthModule {}
