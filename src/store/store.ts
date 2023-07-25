import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/sliceUser";
import categoriesReducer from "./slices/sliceCategories";
import expensesReducer from "./slices/sliceExpenses";
import rangeReducer from "./slices/sliceRange";

const store = configureStore({
  reducer: {
    user: userReducer,
    categories: categoriesReducer,
    expenses: expensesReducer,
    range: rangeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
