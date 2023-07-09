import { Module } from '@nestjs/common';
import { PrismaConnector } from '../data/prisma';
import { StatementController } from 'src/presentation/controllers/statement.controller';

@Module({
  providers: [PrismaConnector],
  controllers: [StatementController],
})
export class StatmentModule {}
