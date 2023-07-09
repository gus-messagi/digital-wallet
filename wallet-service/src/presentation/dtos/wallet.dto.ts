import { IsNotEmpty, IsUUID } from 'class-validator';
import { BalanceRequest } from 'src/infrastructure/protos/wallet.pb';

export class BalanceRequestDTO implements BalanceRequest {
  @IsNotEmpty()
  @IsUUID()
  public readonly userId: string;
}
