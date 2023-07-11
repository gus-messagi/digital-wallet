import { Inject, Injectable } from '@nestjs/common';
import { PrismaConnector } from '../prisma';
import { EventRepository } from 'src/domain/repositories/event.repository';

@Injectable()
export class EventImplRepository implements EventRepository {
  @Inject(PrismaConnector)
  private readonly db: PrismaConnector;

  async create(eventId: string, statementId: string): Promise<void> {
    await this.db.event.create({ data: { eventId, statementId } });
  }
  async existsEvent(eventId: string): Promise<boolean> {
    return !!(await this.db.event.findFirst({ where: { eventId } }));
  }
}
