export interface StatementDTO {
  userId: string;
  transaction: {
    id: string;
    amount: number;
  };
}
