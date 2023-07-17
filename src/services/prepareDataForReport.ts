import { IExpense } from "../model/expense/Expense";
import { IRange } from "../store/slices/sliceRange";
import { IConvertCategory } from "./convertCategory";

interface IGroupingForTable {
  categoryId: string;
  subcategoryId: string;
  amount: number;
}

interface IGroupingForChart {
  categoryId: string;
  amount: number;
}

type IPreparedDataForTable = [string, string, number];
type IPreparedDataForChart = [string, number];

const filteredExpensesForRange = (expenses: IExpense[], range: IRange) =>
  expenses.filter((expense) => {
    const date = new Date(expense.date);
    return date >= new Date(range.startDate) && date <= new Date(range.endDate);
  });

export const prepareDataForReport = (
  typeReport: "table" | "chart",
  expenses: IExpense[],
  range: IRange,
  categories: IConvertCategory[],
) => {
  const filteredExpenses = filteredExpensesForRange(expenses, range);

  if (typeReport === "table") {
    const groupedExpenses: IGroupingForTable[] = [];

    filteredExpenses.forEach((expense) => {
      const groupedElement = groupedExpenses.find(
        (item) =>
          item.categoryId === expense.categoryId &&
          item.subcategoryId === expense.subcategoryId,
      );

      if (groupedElement) {
        const index = groupedExpenses.indexOf(groupedElement);
        groupedExpenses[index].amount += expense.amount;
      } else {
        groupedExpenses.push({
          categoryId: expense.categoryId,
          subcategoryId: expense.subcategoryId,
          amount: expense.amount,
        });
      }
    });

    return groupedExpenses.map((expense) => {
      const row: IPreparedDataForTable = ["", "", 0];
      const category = categories.find(
        (item) => item.id === expense.categoryId,
      );

      if (category) {
        row[0] = category.name;

        const subCategory = category.subcategories.find(
          (item) => item.id === expense.subcategoryId,
        );

        if (subCategory) {
          row[1] = subCategory.name;
        }
      }

      row[2] = expense.amount;

      return row;
    });
  }

  const groupedExpenses: IGroupingForChart[] = [];

  filteredExpenses.forEach((expense) => {
    const groupedElement = groupedExpenses.find(
      (item) => item.categoryId === expense.categoryId,
    );

    if (groupedElement) {
      const index = groupedExpenses.indexOf(groupedElement);
      groupedExpenses[index].amount += expense.amount;
    } else {
      groupedExpenses.push({
        categoryId: expense.categoryId,
        amount: expense.amount,
      });
    }
  });

  return groupedExpenses.map((expense) => {
    const row: IPreparedDataForChart = ["", 0];
    const category = categories.find((item) => item.id === expense.categoryId);

    if (category) {
      row[0] = category.name;
    }

    row[1] = expense.amount;

    return row;
  });
};
