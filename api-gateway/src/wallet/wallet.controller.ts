import {
  Body,
  Controller,
  Get,
  Inject,
  OnModuleInit,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  TransactionRequest,
  TransactionResponse,
  WALLET_SERVICE_NAME,
  WalletServiceClient,
} from './wallet.pb';
import { Observable, firstValueFrom } from 'rxjs';
import { ClientGrpc } from '@nestjs/microservices';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request, Response } from 'express';

@Controller('wallet')
export class WalletController implements OnModuleInit {
  public serviceClient: WalletServiceClient;

  @Inject(WALLET_SERVICE_NAME)
  private readonly client: ClientGrpc;

  public onModuleInit(): void {
    this.serviceClient =
      this.client.getService<WalletServiceClient>(WALLET_SERVICE_NAME);
  }

  @Post('transaction')
  async transaction(
    @Body() body: TransactionRequest,
  ): Promise<Observable<TransactionResponse>> {
    return this.serviceClient.transaction(body);
  }

  @Get('balance')
  @UseGuards(AuthGuard)
  async balance(
    @Req() request: Request & { user: string },
    @Res() response: Response,
  ): Promise<Response> {
    const userId = request.user;

    const { balance, status } = await firstValueFrom(
      this.serviceClient.balance({ userId }),
    );

    const mapToView = { status, balance: Number(balance.toFixed(2)) };

    return response.status(status).json(mapToView);
  }
}
