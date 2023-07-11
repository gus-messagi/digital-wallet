import { Controller, HttpStatus, Inject } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { WalletService } from 'src/domain/services/wallet.service';
import {
  BalanceResponse,
  WALLET_SERVICE_NAME,
} from 'src/infrastructure/protos/wallet.pb';
import { BalanceRequestDTO } from '../dtos/wallet.dto';

@Controller('wallet')
export class WalletController {
  @Inject(WalletService)
  private readonly service: WalletService;

  @GrpcMethod(WALLET_SERVICE_NAME, 'Balance')
  async balance(payload: BalanceRequestDTO): Promise<BalanceResponse> {
    const response = await this.service.getBalance(payload.userId);

    return {
      status: HttpStatus.OK,
      error: null,
      balance: response,
    };
  }
}
