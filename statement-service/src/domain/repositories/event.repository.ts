export interface EventRepository {
  create: (eventId: string, statementId: string) => Promise<void>;
  existsEvent: (eventId: string) => Promise<boolean>;
}
