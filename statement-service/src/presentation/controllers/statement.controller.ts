import { Controller, Inject } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { StatementDTO } from 'src/domain/dtos/statement.dto';
import { StatementService } from 'src/domain/services/statement.service';

@Controller()
export class StatementController {
  @Inject(StatementService)
  private readonly service: StatementService;

  @EventPattern('transaction_created')
  public async handle(
    @Payload() data: StatementDTO,
    @Ctx() context: RmqContext,
  ) {
    console.log(`Data received: ${JSON.stringify(data)}`);
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    await this.service.create(data);

    channel.ack(originalMessage);
  }
}
