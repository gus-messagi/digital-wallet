import { ApiProperty } from '@nestjs/swagger';
import { GenerateStatementRequest } from './statement.pb';

enum OperationGenerateEnum {
  deposit = 'deposit',
  withdraw = 'withdraw',
  cancellation = 'cancellation',
  purchase = 'purchase',
  reversal = 'reversal',
}

class StatementRecord {
  @ApiProperty({
    description: 'The amount from transaction',
    example: 'R$ 100.00',
  })
  amount: string;

  @ApiProperty({
    description: 'The balance after transaction',
    example: 'R$ 200.00',
  })
  balance: string;

  @ApiProperty({
    enum: OperationGenerateEnum,
    description: 'The transaction operation',
    example: 'deposit',
  })
  operation: OperationGenerateEnum;

  @ApiProperty({
    description: 'The transaction date',
    example: '2023-07-10',
  })
  date: string;
}

export class GenerateStatementDTO
  implements Omit<GenerateStatementRequest, 'userId'>
{
  @ApiProperty({
    description: 'Maximium date to generate statements file',
    example: '2023-07-10',
  })
  maxDate: string;
}

export class GenerateStatementResponseDTO {
  @ApiProperty({
    required: false,
    type: [StatementRecord],
  })
  items: StatementRecord[];
}
