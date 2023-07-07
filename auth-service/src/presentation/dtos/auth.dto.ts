import { IsEmail, IsString, MinLength } from 'class-validator';
import {
  SignInRequest,
  SignUpRequest,
  ValidationRequest,
} from 'src/infrastructure/protos/auth.pb';

export class SignUpRequestDTO implements SignUpRequest {
  @IsEmail()
  public readonly email: string;

  @IsString()
  @MinLength(6)
  public readonly password: string;

  @IsString()
  @MinLength(6)
  public readonly confirmPassword: string;
}

export class SignInRequestDTO implements SignInRequest {
  @IsEmail()
  public readonly email: string;

  @IsString()
  @MinLength(6)
  public readonly password: string;
}

export class ValidationRequestDTO implements ValidationRequest {
  @IsString()
  public readonly token: string;
}
