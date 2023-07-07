import { Controller, HttpStatus, Inject } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {
  AUTH_SERVICE_NAME,
  SignInResponse,
  SignUpResponse,
  ValidationResponse,
} from 'src/infrastructure/protos/auth.pb';
import {
  SignInRequestDTO,
  SignUpRequestDTO,
  ValidationRequestDTO,
} from '../dtos/auth.dto';
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

  @GrpcMethod(AUTH_SERVICE_NAME, 'SignIn')
  async signIn(payload: SignInRequestDTO): Promise<SignInResponse> {
    const response = await this.service.signIn(payload);

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

  @GrpcMethod(AUTH_SERVICE_NAME, 'Validation')
  async validation(payload: ValidationRequestDTO): Promise<ValidationResponse> {
    const response = await this.service.validation(payload.token);

    if (response.err) {
      return {
        status: HttpStatus.UNAUTHORIZED,
        userId: null,
        error: [response.val],
      };
    }

    return {
      status: HttpStatus.OK,
      userId: response.unwrap(),
      error: null,
    };
  }
}
