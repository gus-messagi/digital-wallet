export const environment = () => ({
  statementQueue: process.env.STATEMENT_QUEUE || '',
  rabbitmqUrl: process.env.RABBITMQ_URL,
  databaseUrl: process.env.DATABASE_URL,
  serviceHost: process.env.SERVICE_HOST,
  walletQueue: process.env.WALLET_QUEUE,
});
