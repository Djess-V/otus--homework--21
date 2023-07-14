import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IExpense } from "../../model/expense/Expense";

const initialState: IExpense[] = [];

const expensesSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {
    addExpenses: (state, action: PayloadAction<IExpense[]>) => {
      state = action.payload;
      return state;
    },

    addExpense: (state, action: PayloadAction<IExpense>) => {
      state.push(action.payload);
      return state;
    },

    deleteExpense: (state, action: PayloadAction<string>) =>
      state.filter((item) => item.id !== action.payload),
  },
});

export const { addExpenses, addExpense, deleteExpense } = expensesSlice.actions;

export default expensesSlice.reducer;