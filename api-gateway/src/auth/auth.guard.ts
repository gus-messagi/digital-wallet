import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';

export class AuthGuard implements CanActivate {
  @Inject(AuthService)
  public readonly service: AuthService;

  public async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> | never {
    const req: Request & { user: string } = context.switchToHttp().getRequest();
    const authorization = req.cookies['token'];

    if (!authorization) {
      throw new UnauthorizedException();
    }

    const { userId, status } = await this.service.validation(authorization);

    if (status !== HttpStatus.OK) {
      throw new UnauthorizedException();
    }

    req.user = userId;

    return true;
  }
}
