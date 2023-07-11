import { join } from 'path';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { protobufPackage } from './infrastructure/protos/wallet.pb';
import { HttpExceptionMiddleware } from './infrastructure/http/middlewares/exception.middleware';
import { ValidationPipe } from '@nestjs/common';
import { PrismaConnector } from './infrastructure/data/prisma';
import { environment } from './infrastructure/config/environment.config';

async function bootstrap() {
  const env = environment();

  const app = await NestFactory.create(AppModule);

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [env.rabbitmqUrl],
      queue: env.walletQueue,
      prefetchCount: 1,
      noAck: false,
    },
  });

  app.connectMicroservice({
    transport: Transport.GRPC,
    options: {
      url: env.serviceHost,
      package: protobufPackage,
      protoPath: join('node_modules/digital-wallet-proto/proto/wallet.proto'),
    },
  });

  const prisma = app.get(PrismaConnector);

  await prisma.enableShutdownHooks(app);

  app.useGlobalFilters(new HttpExceptionMiddleware());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  await app.startAllMicroservices();
  await prisma.enableShutdownHooks(app);
}

bootstrap();
