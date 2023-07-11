export interface EventRepository {
  create: (eventId: string, transactionId: string) => Promise<void>;
  existsEvent: (eventId: string) => Promise<boolean>;
}
