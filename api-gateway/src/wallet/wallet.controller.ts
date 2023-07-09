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
import { WALLET_SERVICE_NAME, WalletServiceClient } from './wallet.pb';
import { firstValueFrom } from 'rxjs';
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
  @UseGuards(AuthGuard)
  async transaction(
    @Req() request: Request & { user: string },
    @Res() response: Response,
  ): Promise<Response> {
    const body = request.body;
    const userId = request.user;

    const { status, error } = await firstValueFrom(
      this.serviceClient.transaction({ ...body, userId }),
    );

    return response.status(status).json({ status, error });
  }

  @Get('balance')
  @UseGuards(AuthGuard)
  async balance(
    @Req() request: Request & { user: string },
    @Res() response: Response,
  ): Promise<Response> {
    const userId = request.user;

    const { balance, status, error } = await firstValueFrom(
      this.serviceClient.balance({ userId }),
    );

    const mapToView = { status, balance: Number(balance.toFixed(2)), error };

    return response.status(status).json(mapToView);
  }
}
