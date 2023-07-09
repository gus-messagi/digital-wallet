import { INestMicroservice, Injectable, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

const prismaSetup: Prisma.PrismaClientOptions = {
  log: ['query', 'info', 'warn', 'error'],
};

@Injectable()
export class PrismaConnector extends PrismaClient implements OnModuleInit {
  constructor() {
    super(prismaSetup);
  }

  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestMicroservice) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
