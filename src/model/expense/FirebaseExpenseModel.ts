import { Database, ref, set, get, child } from "firebase/database";
import ExpenseModel from "./ExpenseModel";
import { IExpense } from "./Expense";
import { convertExpensesForStore } from "../../services/convertExpense";

class FirebaseExpenseModel extends ExpenseModel {
  private db;

  private parentCollectionName;

  private collectionName;

  constructor(
    db: Database,
    parentCollectionName: string,
    collectionName: string,
  ) {
    super();
    this.db = db;
    this.parentCollectionName = parentCollectionName;
    this.collectionName = collectionName;
  }

  async getAll(userId: string): Promise<IExpense[] | null> {
    try {
      const dbRef = ref(this.db);
      const snapshot = await get(
        child(
          dbRef,
          `${this.parentCollectionName}${userId}${this.collectionName}`,
        ),
      );
      if (snapshot.exists()) {
        return convertExpensesForStore(snapshot.val());
      }

      throw new Error("No expenses in Firebase!");
    } catch (e) {
      console.log((e as Error).message);
      return null;
    }
  }

  async create(userId: string, expense: IExpense): Promise<string | null> {
    try {
      await set(
        ref(
          this.db,
          `${this.parentCollectionName}${userId}${`${this.collectionName}/`}${
            expense.id
          }`,
        ),
        expense,
      );

      return expense.id;
    } catch (e) {
      return null;
    }
  }

  async delete(userId: string, id: string): Promise<boolean> {
    return false;
  }

  async deleteAll(userId: string): Promise<boolean> {
    return false;
  }
}

export default FirebaseExpenseModel;
