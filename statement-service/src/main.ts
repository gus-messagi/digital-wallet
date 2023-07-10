import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { PrismaConnector } from './infrastructure/data/prisma';
import { environment } from './infrastructure/config/environment.config';
import { join } from 'path';
import { protobufPackage } from './infrastructure/protos/statement.pb';

async function bootstrap() {
  const env = environment();

  const app = await NestFactory.create(AppModule);

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [env.rabbitmqUrl],
      queue: env.statementQueue,
      prefetchCount: 1,
      noAck: false,
    },
  });

  app.connectMicroservice({
    transport: Transport.GRPC,
    options: {
      url: env.microserviceUrl,
      package: protobufPackage,
      protoPath: join(
        'node_modules/digital-wallet-proto/proto/statement.proto',
      ),
    },
  });

  const prisma = app.get(PrismaConnector);
  await app.startAllMicroservices();
  await prisma.enableShutdownHooks(app);
}

bootstrap();
