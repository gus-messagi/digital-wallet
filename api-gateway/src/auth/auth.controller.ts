import { Body, Controller, Inject, Post, Res } from '@nestjs/common';
import { SignInRequest, SignUpRequest } from './auth.pb';
import { firstValueFrom } from 'rxjs';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SignInRequestDTO, SignUpRequestDTO } from './auth.dto';

@ApiTags('Authentication Service')
@Controller('auth')
export class AuthController {
  @Inject(AuthService)
  private service: AuthService;

  @Post('sign-in')
  @ApiBody({ type: SignInRequestDTO })
  @ApiResponse({ status: 200, description: 'Authorized' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
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
  @ApiBody({ type: SignUpRequestDTO })
  @ApiResponse({ status: 201, description: 'Created' })
  @ApiResponse({
    status: 400,
    description: 'Can be passwords matching or email already exists',
  })
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
