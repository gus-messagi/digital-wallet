export const env = () => ({
  statementQueue: process.env.STATEMENT_QUEUE || '',
  rabbitmqUrl: process.env.RABBITMQ_URL,
});
