import { v4 } from "uuid";

export interface IExpense {
  id: string;
  date: number;
  categoryId: string;
  subcategoryId: string;
  amount: number;
}

export const createExpense = (
  date: number,
  categoryId: string,
  subcategoryId: string,
  amount: number,
): IExpense => ({
  id: v4(),
  date,
  categoryId,
  subcategoryId,
  amount,
});
