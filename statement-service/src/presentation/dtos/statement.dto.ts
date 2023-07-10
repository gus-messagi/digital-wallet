import { IsNotEmpty, IsString } from 'class-validator';
import { GenerateStatementRequest } from 'src/infrastructure/protos/statement.pb';

export class GenerateStatementRequestDTO implements GenerateStatementRequest {
  @IsString()
  @IsNotEmpty()
  public readonly userId: string;
  @IsString()
  @IsNotEmpty()
  public readonly maxDate: string;
}
