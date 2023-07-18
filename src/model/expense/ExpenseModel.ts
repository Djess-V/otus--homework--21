import { IExpense } from "./Expense";

abstract class ExpenseModel {
  abstract getAll(userId: string): Promise<IExpense[] | null>;

  abstract create(userId: string, expense: IExpense): Promise<string | null>;

  abstract deleteExpensesOfDeletedCategory(
    userId: string,
    expenseIds: string[],
  ): Promise<boolean>;
}

export default ExpenseModel;
