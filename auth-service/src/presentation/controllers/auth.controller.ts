import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {
  AUTH_SERVICE_NAME,
  SignUpResponse,
} from 'src/infrastructure/protos/auth.pb';
import { SignUpRequestDTO } from '../dtos/auth.dto';

@Controller('auth')
export class AuthController {
  @GrpcMethod(AUTH_SERVICE_NAME, 'SignUp')
  private async signUp(payload: SignUpRequestDTO): Promise<void> {
    console.log('Hello World')
  }
}
