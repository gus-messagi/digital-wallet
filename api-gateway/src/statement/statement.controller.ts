import {
  Controller,
  Inject,
  OnModuleInit,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { STATEMENT_SERVICE_NAME, StatementServiceClient } from './statement.pb';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request, Response } from 'express';

@Controller('statement')
export class StatementController implements OnModuleInit {
  public serviceClient: StatementServiceClient;

  @Inject(STATEMENT_SERVICE_NAME)
  private readonly client: ClientGrpc;

  public onModuleInit(): void {
    this.serviceClient = this.client.getService<StatementServiceClient>(
      STATEMENT_SERVICE_NAME,
    );
  }

  @Post('generate')
  @UseGuards(AuthGuard)
  async transaction(
    @Req() request: Request & { user: string },
    @Res() response: Response,
  ): Promise<Response> {
    const body = request.body;
    const userId = request.user;

    const { status, error, items } = await firstValueFrom(
      this.serviceClient.generateStatement({ maxDate: body.maxDate, userId }),
    );

    return response.status(status).json({ status, error, items });
  }
}
