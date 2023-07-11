import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import {
  GetTransactionsRequest,
  Operation,
  TransactionRequest,
} from 'src/infrastructure/protos/wallet.pb';

export interface TransactionEventDTO {
  userId: string;
  transaction: {
    id?: string;
    amount?: number;
    operation: Operation;
  };
}

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

export class GetTransactionsRequestDTO implements GetTransactionsRequest {
  @IsString()
  @IsNotEmpty()
  public readonly userId: string;

  @IsString()
  @IsNotEmpty()
  public readonly maxDate: string;
}
