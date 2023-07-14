import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/sliceAuth";
import userReducer from "./slices/sliceUser";
import categoriesReducer from "./slices/sliceCategories";
import expensesReducer from "./slices/sliceExpenses";

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    categories: categoriesReducer,
    expenses: expensesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
