import { ApiProperty } from '@nestjs/swagger';
import { SignInRequest, SignUpRequest } from './auth.pb';

export class SignInRequestDTO implements SignInRequest {
  @ApiProperty({
    example: 'gustavo.ramos.messagi@gmail.com',
  })
  email: string;
  @ApiProperty({
    example: '123456',
  })
  password: string;
}

export class SignUpRequestDTO implements SignUpRequest {
  @ApiProperty({
    example: 'gustavo.ramos.messagi@gmail.com',
  })
  email: string;
  @ApiProperty({
    example: '123456',
    minLength: 6,
  })
  password: string;
  @ApiProperty({
    example: '123456',
    minLength: 6,
  })
  confirmPassword: string;
}
