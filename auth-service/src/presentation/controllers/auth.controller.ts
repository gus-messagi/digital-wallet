import { Controller, HttpStatus, Inject } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {
  AUTH_SERVICE_NAME,
  SignUpResponse,
} from 'src/infrastructure/protos/auth.pb';
import { SignUpRequestDTO } from '../dtos/auth.dto';
import { AuthService } from 'src/domain/services/auth.service';

@Controller('auth')
export class AuthController {
  @Inject(AuthService)
  private readonly service: AuthService;

  @GrpcMethod(AUTH_SERVICE_NAME, 'SignUp')
  async signUp(payload: SignUpRequestDTO): Promise<SignUpResponse> {
    const response = await this.service.signUp(payload);

    if (response.err) {
      return {
        status: HttpStatus.BAD_REQUEST,
        token: null,
        error: [response.val],
      };
    }

    return {
      status: HttpStatus.OK,
      token: response.unwrap(),
      error: null,
    };
  }
}
