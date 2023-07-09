import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { StatementDTO } from 'src/domain/dtos/statement.dto';

@Controller()
export class StatementController {
  @EventPattern('transaction_created')
  public async handle(
    @Payload() data: StatementDTO,
    @Ctx() context: RmqContext,
  ) {
    console.log({ data });
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    console.log({ channel, originalMessage });
    console.log('data', data);

    channel.ack(originalMessage);
  }
}
