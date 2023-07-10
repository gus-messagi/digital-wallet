import { Injectable } from '@nestjs/common';
import { stringify } from 'csv-stringify';
import { StatementRecord } from '../dtos/statement.dto';

@Injectable()
export class FileService {
  create(data: StatementRecord[]) {
    const columns = [
      { key: 'operation', header: 'Operação' },
      { key: 'date', header: 'Data da Operação' },
      { key: 'amount', header: 'Valor' },
      { key: 'balance', header: 'Saldo ' },
    ];

    return stringify(data, { header: true, columns }).unpipe();
  }
}
