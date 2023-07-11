import { ApiProperty } from '@nestjs/swagger';
import { Operation, TransactionRequest } from './wallet.pb';

export class TransactionRequestDTO
  implements Omit<TransactionRequest, 'userId'>
{
  @ApiProperty({
    enum: Operation,
    enumName: 'Operation',
    example: 0,
    description: 'Enum to deal with operatons: 0 = deposit',
  })
  operation: Operation;

  @ApiProperty({
    description:
      'Transaction ID used when you need to cancel or reverse a transaction',
    example: '304984bd-852a-4b66-9503-8777b93fb2a5',
    required: false,
  })
  transactionId?: string;
  @ApiProperty({
    description: 'For deposit, purchase and withdraw operations',
    example: '159.99',
    required: false,
  })
  amount?: number;
}

export class BalanceResponseDTO {
  @ApiProperty({ example: '159.99' })
  balance: number;
}
