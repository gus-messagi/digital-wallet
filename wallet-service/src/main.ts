import { join } from 'path';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { protobufPackage } from './infrastructure/protos/wallet.pb';
import { HttpExceptionMiddleware } from './infrastructure/http/middlewares/exception.middleware';
import { ValidationPipe } from '@nestjs/common';
import { PrismaConnector } from './infrastructure/data/prisma';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.GRPC,
    options: {
      url: '0.0.0.0:50051',
      package: protobufPackage,
      protoPath: join('node_modules/digital-wallet-proto/proto/wallet.proto'),
    },
  });

  const prisma = app.get(PrismaConnector);

  await prisma.enableShutdownHooks(app);

  app.useGlobalFilters(new HttpExceptionMiddleware());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  await app.listen();
}

bootstrap();
