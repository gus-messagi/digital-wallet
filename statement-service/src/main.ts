import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { PrismaConnector } from './infrastructure/data/prisma';
import { environment } from './infrastructure/config/environment.config';

async function bootstrap() {
  const env = environment();

  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [env.rabbitmqUrl],
      queue: env.statementQueue,
      prefetchCount: 1,
      noAck: false,
    },
  });

  const prisma = app.get(PrismaConnector);

  await prisma.enableShutdownHooks(app);
  await app.listen();
}

bootstrap();
