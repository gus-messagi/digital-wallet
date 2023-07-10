import { IsNotEmpty, IsUUID } from 'class-validator';
import { GetUserByIdRequest } from 'src/infrastructure/protos/auth.pb';

export class GetUserByIdRequestDTO implements GetUserByIdRequest {
  @IsNotEmpty()
  @IsUUID()
  public readonly id: string;
}
