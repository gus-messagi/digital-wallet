export const env = () => ({
  secret: process.env.SECRET || '',
  salt: Number(process.env.SALT) || 10,
});
