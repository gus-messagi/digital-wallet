import { Controller, HttpStatus, Inject } from '@nestjs/common';
import {
  ClientProxy,
  Ctx,
  EventPattern,
  GrpcMethod,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { StatementDTO } from 'src/domain/dtos/statement.dto';
import { StatementService } from 'src/domain/services/statement.service';
import { STATEMENT_SERVICE_NAME } from 'src/infrastructure/protos/statement.pb';
import { GenerateStatementRequestDTO } from '../dtos/statement.dto';

@Controller()
export class StatementController {
  @Inject(StatementService)
  private readonly service: StatementService;

  @Inject('rabbitmq-module')
  private readonly client: ClientProxy;

  @EventPattern('transaction_created')
  public async handleTransactionCreated(
    @Payload() data: StatementDTO,
    @Ctx() context: RmqContext,
  ) {
    console.log(`Data received: ${JSON.stringify(data)}`);
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    const eventId = originalMessage.properties.messageId;

    await this.service.create(data, eventId);

    channel.ack(originalMessage);
  }

  @EventPattern('statement_requested')
  public async handleStatementRequested(
    @Payload() data: GenerateStatementRequestDTO,
    @Ctx() context: RmqContext,
  ) {
    console.log(`Data received: ${JSON.stringify(data)}`);
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    const mapToDomain = {
      ...data,
      maxDate: new Date(data.maxDate),
    };

    const statementData = await this.service.generateData(mapToDomain, true);

    if (!statementData.err) {
      await this.service.handleFile(data.userId, statementData.unwrap());
    }

    channel.ack(originalMessage);
  }

  @GrpcMethod(STATEMENT_SERVICE_NAME, 'GenerateStatement')
  async generate(payload: GenerateStatementRequestDTO) {
    const now = new Date();
    const maxDate = new Date(payload.maxDate);
    const datesDiff = Math.round(
      Math.abs(Number(now) - Number(maxDate)) / (1000 * 60 * 60 * 24),
    );

    if (datesDiff >= 15) {
      this.client.emit('statement_requested', payload);

      return {
        status: HttpStatus.OK,
        error: null,
      };
    }

    const mapToDomain = {
      ...payload,
      maxDate,
    };

    const response = await this.service.generateData(mapToDomain);

    if (response.err) {
      return {
        status: HttpStatus.NOT_FOUND,
        error: response.val,
      };
    }

    return {
      status: HttpStatus.OK,
      items: response.val,
    };
  }
}
