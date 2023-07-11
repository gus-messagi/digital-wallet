import { Controller, HttpStatus, Inject } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  GrpcMethod,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import {
  GetTransactionsResponse,
  TransactionItem,
  TransactionResponse,
  WALLET_SERVICE_NAME,
} from 'src/infrastructure/protos/wallet.pb';
import {
  GetTransactionsRequestDTO,
  TransactionEventDTO,
  TransactionRequestDTO,
} from '../dtos/transaction.dto';
import { TransactionService } from 'src/domain/services/transaction.service';
import { Operation } from 'src/domain/enums/transaction.enum';

@Controller('transaction')
export class TransactionController {
  @Inject(TransactionService)
  private readonly service: TransactionService;

  @EventPattern('transaction_emitted')
  public async handleTransactionEmitted(
    @Payload() data: TransactionEventDTO,
    @Ctx() context: RmqContext,
  ) {
    console.log(`Data received: ${JSON.stringify(data)}`);
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    const mapToDomain = {
      ...(data.transaction.amount && {
        amount: Number(data.transaction.amount.toFixed(2)),
      }),
      ...(data.transaction.id && { parentId: data.transaction.id }),
      operation: Operation[Object.keys(Operation)[data.transaction.operation]],
      userId: data.userId,
    };
    const eventId = originalMessage.properties.messageId;

    await this.service.operation(mapToDomain, eventId);

    channel.ack(originalMessage);
  }

  @GrpcMethod(WALLET_SERVICE_NAME, 'GetTransactions')
  async getTransactions(
    payload: GetTransactionsRequestDTO,
  ): Promise<GetTransactionsResponse> {
    const mapToDomain = {
      ...payload,
      maxDate: new Date(payload.maxDate),
    };

    const response = await this.service.getTransactions(mapToDomain);

    if (response.err) {
      return {
        status: HttpStatus.NOT_FOUND,
        error: [response.val],
        items: [],
      };
    }

    const items = response.unwrap() as unknown as TransactionItem[];

    return {
      status: HttpStatus.OK,
      error: null,
      items,
    };
  }

  @GrpcMethod(WALLET_SERVICE_NAME, 'Transaction')
  async operation(
    payload: TransactionRequestDTO,
  ): Promise<TransactionResponse> {
    const mapToDomain = {
      ...payload,
      ...(payload.amount && { amount: Number(payload.amount.toFixed(2)) }),
      ...(payload.transactionId && { parentId: payload.transactionId }),
      operation: Operation[Object.keys(Operation)[payload.operation]],
    };

    const response = await this.service.operation(mapToDomain);

    if (response.err) {
      return {
        status: HttpStatus.BAD_REQUEST,
        error: [response.val],
      };
    }

    return {
      status: HttpStatus.CREATED,
      error: null,
    };
  }
}
