import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
} from 'class-validator';
import {
  Operation,
  TransactionRequest,
} from 'src/infrastructure/protos/wallet.pb';

export class TransactionRequestDTO implements TransactionRequest {
  @IsUUID()
  @IsNotEmpty()
  public readonly userId: string;

  @IsNotEmpty()
  @IsNumber()
  @IsEnum(Operation)
  public readonly operation: Operation;

  @IsOptional()
  @IsUUID()
  public readonly transactionId?: string;

  @IsNumber()
  @IsOptional()
  public readonly amount?: number;
}
