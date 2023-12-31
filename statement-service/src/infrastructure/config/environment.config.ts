export const environment = () => ({
  statementQueue: process.env.STATEMENT_QUEUE || '',
  rabbitmqUrl: process.env.RABBITMQ_URL || 'amqp://rabbitmq:5672',
  authServiceUrl: process.env.AUTH_SERVICE_URL || '0.0.0.0:50051',
  walletServiceUrl: process.env.WALLET_SERVICE_URL || '0.0.0.0:50052',
  microserviceUrl: process.env.MICROSERVICE_URL || '0.0.0.0:50053',
  mailHost: process.env.MAIL_HOST,
  mailPort: process.env.MAIL_PORT,
  mailUser: process.env.MAIL_USER,
  mailPassword: process.env.MAIL_PASSWORD,
  mailFrom: process.env.MAIL_FROM,
  databaseUrl: process.env.DATABASE_URL,
});
