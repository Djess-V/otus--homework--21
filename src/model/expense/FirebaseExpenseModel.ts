import { Database, ref, set, get, child, remove } from "firebase/database";
import { IExpense } from "./Expense";
import { convertExpensesForStore } from "../../services/convertExpense";

abstract class ExpenseModel {
  abstract getAll(userId: string): Promise<IExpense[] | null>;

  abstract create(userId: string, expense: IExpense): Promise<string | null>;

  abstract deleteExpensesOfDeletedCategory(
    userId: string,
    expenseIds: string[],
  ): Promise<boolean>;
}

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

  async deleteExpensesOfDeletedCategory(
    userId: string,
    expenseIds: string[],
  ): Promise<boolean> {
    try {
      for (const id of expenseIds) {
        await remove(
          ref(
            this.db,
            `${
              this.parentCollectionName
            }${userId}${`${this.collectionName}/`}${id}`,
          ),
        );
      }

      return true;
    } catch (e) {
      return false;
    }
  }
}

export default FirebaseExpenseModel;
