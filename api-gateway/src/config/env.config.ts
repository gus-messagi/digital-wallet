export const environment = () => ({
  authServiceUrl: process.env.AUTH_SERVICE_URL || '172.19.0.3:50051',
  walletServiceUrl: process.env.WALLET_SERVICE_URL || '0.0.0.0:50052',
  statementServiceUrl: process.env.STATEMENT_SERVICE_URL || '0.0.0.0:50053',
});
