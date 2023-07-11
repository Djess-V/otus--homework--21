import { Database } from "firebase/database";
import Transaction from "./Transaction";
import TransactionModel from "./TransactionModel";

class FirebaseTransactionModel extends TransactionModel {
  private db;

  private parentCollectionName;

  private collectionName;

  constructor(
    db: Database,
    parentCollectionName: string,
    collectionName: string
  ) {
    super();
    this.db = db;
    this.parentCollectionName = parentCollectionName;
    this.collectionName = collectionName;
  }

  async getAll(userId: string): Promise<Transaction[] | null> {
    return null;
  }

  async create(
    userId: string,
    transaction: Transaction
  ): Promise<string | null> {
    return null;
  }

  async delete(userId: string, id: string): Promise<boolean> {
    return false;
  }

  async deleteAll(userId: string): Promise<boolean> {
    return false;
  }
}

export default FirebaseTransactionModel;
