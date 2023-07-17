import { IExpense } from "./Expense";

abstract class ExpenseModel {
  abstract getAll(userId: string): Promise<IExpense[] | null>;

  abstract create(userId: string, expense: IExpense): Promise<string | null>;
}

export default ExpenseModel;
