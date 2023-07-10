import { Module } from '@nestjs/common';
import { UserService } from 'src/domain/services/user.service';
import { UserController } from 'src/presentation/controllers/user.controller';
import { UserImplRepository } from '../data/repositories/user-impl.repository';
import { PrismaConnector } from '../data/prisma';

@Module({
  controllers: [UserController],
  providers: [UserService, UserImplRepository, PrismaConnector],
})
export class UserModule {}
