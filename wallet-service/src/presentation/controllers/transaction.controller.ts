import { Controller, HttpStatus, Inject } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {
  TransactionResponse,
  WALLET_SERVICE_NAME,
} from 'src/infrastructure/protos/wallet.pb';
import { TransactionRequestDTO } from '../dtos/transaction.dto';
import { TransactionService } from 'src/domain/services/transaction.service';
import { Operation } from 'src/domain/enums/transaction.enum';

@Controller('transaction')
export class TransactionController {
  @Inject(TransactionService)
  private readonly service: TransactionService;

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
