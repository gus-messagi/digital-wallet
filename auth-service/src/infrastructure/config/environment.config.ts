export const env = () => ({
  databaseConnection: process.env.DATABASE_URL,
  secret: process.env.SECRET || '',
  salt: Number(process.env.SALT) || 10,
  serviceHost: process.env.SERVICE_HOST,
});
