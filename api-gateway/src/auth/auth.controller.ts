import { Body, Controller, Inject, Post } from '@nestjs/common';
import {
  SignInRequest,
  SignInResponse,
  SignUpRequest,
  SignUpResponse,
} from './auth.pb';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  @Inject(AuthService)
  private service: AuthService;

  @Post('sign-in')
  async signIn(
    @Body() body: SignInRequest,
  ): Promise<Observable<SignInResponse>> {
    return this.service.serviceClient.signIn(body);
  }

  @Post('sign-up')
  async signUp(
    @Body() body: SignUpRequest,
  ): Promise<Observable<SignUpResponse>> {
    return this.service.serviceClient.signUp(body);
  }
}
