import { IExpense } from "./Expense";

abstract class ExpenseModel {
  abstract getAll(userId: string): Promise<IExpense[] | null>;

  abstract create(userId: string, expense: IExpense): Promise<string | null>;

  abstract delete(userId: string, id: string): Promise<boolean>;

  abstract deleteAll(userId: string): Promise<boolean>;
}

export default ExpenseModel;
