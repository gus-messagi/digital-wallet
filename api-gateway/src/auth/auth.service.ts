import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import {
  AUTH_SERVICE_NAME,
  AuthServiceClient,
  ValidationResponse,
} from './auth.pb';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService implements OnModuleInit {
  public serviceClient: AuthServiceClient;

  @Inject(AUTH_SERVICE_NAME)
  private readonly client: ClientGrpc;

  public onModuleInit(): void {
    this.serviceClient =
      this.client.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
  }

  public async validation(token: string): Promise<ValidationResponse> {
    return firstValueFrom(this.serviceClient.validation({ token }));
  }
}
