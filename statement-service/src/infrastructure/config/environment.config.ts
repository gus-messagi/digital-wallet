export const environment = () => ({
  statementQueue: process.env.STATEMENT_QUEUE || '',
  rabbitmqUrl: process.env.RABBITMQ_URL || 'amqp://localhost:5672',
  walletServiceUrl: process.env.WALLET_SERVICE_URL || '0.0.0.0:50052',
});
