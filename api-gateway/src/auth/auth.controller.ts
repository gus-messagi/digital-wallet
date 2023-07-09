import { Body, Controller, Inject, Post, Res } from '@nestjs/common';
import { SignInRequest, SignUpRequest } from './auth.pb';
import { firstValueFrom } from 'rxjs';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  @Inject(AuthService)
  private service: AuthService;

  @Post('sign-in')
  async signIn(
    @Body() body: SignInRequest,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    const { token, status } = await firstValueFrom(
      this.service.serviceClient.signIn(body),
    );

    response.cookie('token', token);
    response.status(status);
  }

  @Post('sign-up')
  async signUp(
    @Body() body: SignUpRequest,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    const { token, status } = await firstValueFrom(
      this.service.serviceClient.signUp(body),
    );

    response.cookie('token', token);
    response.status(status);
  }
}
