import { IExpense } from "../model/expense/Expense";

export const convertExpensesForStore = (expenses: Record<string, IExpense>) => {
  const result: IExpense[] = [];

  Object.keys(expenses).forEach((item) => {
    result.push(expenses[item]);
  });

  return result;
};
