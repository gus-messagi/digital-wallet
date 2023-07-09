export const environment = () => ({
  statementQueue: process.env.STATEMENT_QUEUE || '',
  rabbitmqUrl: process.env.RABBITMQ_URL || 'amqp://localhost:5672',
});
