import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

const prismaSetup: Prisma.PrismaClientOptions = {
  log: ['query', 'info', 'warn', 'error'],
};

@Injectable()
export class PrismaConnector extends PrismaClient {
  constructor() {
    super(prismaSetup);
  }
}
