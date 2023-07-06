import { IsEmail, IsString, MinLength } from 'class-validator';
import { SignUpRequest } from 'src/infrastructure/protos/auth.pb';

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
