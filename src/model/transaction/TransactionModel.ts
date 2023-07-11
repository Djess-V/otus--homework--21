import Transaction from "./Transaction";

abstract class TransactionModel {
  abstract getAll(userId: string): Promise<Transaction[] | null>;

  abstract create(
    userId: string,
    category: Transaction
  ): Promise<string | null>;

  abstract delete(userId: string, id: string): Promise<boolean>;

  abstract deleteAll(userId: string): Promise<boolean>;
}

export default TransactionModel;
