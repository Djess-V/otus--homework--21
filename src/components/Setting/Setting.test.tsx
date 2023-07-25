import React from "react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { v4 } from "uuid";
import userEvent from "@testing-library/user-event";
import Setting from "./Setting";
import store from "../../store/store";
import { addUser } from "../../store/slices/sliceUser";
import { addExpenses } from "../../store/slices/sliceExpenses";

jest.mock("firebase/database", () => {
  const originalModule = jest.requireActual("firebase/database");

  return {
    __esModule: true,
    ...originalModule,
    set: jest.fn(() => Promise.resolve(true)),
    ref: jest.fn(() => true),
    remove: jest.fn(() => Promise.resolve(true)),
  };
});

describe("Setting", () => {
  it("render component", async () => {
    store.dispatch(addUser({ userId: v4(), name: "Евгений" }));
    store.dispatch(
      addExpenses([
        {
          id: "string",
          date: 1456782900,
          categoryId: "string",
          subcategoryId: "string1",
          amount: 1000,
        },
      ]),
    );

    render(
      <MemoryRouter>
        <Provider store={store}>
          <Setting />
        </Provider>
      </MemoryRouter>,
    );

    expect(screen.getByText("Create category:")).toBeInTheDocument();

    const inputCategory = screen.getByTestId("category") as HTMLInputElement;

    await userEvent.type(inputCategory, "Машина");

    await userEvent.click(screen.getByText("Clear form"));

    expect(inputCategory.value).toBe("");

    await userEvent.type(inputCategory, "Машина");

    const inputSubcategories = screen.getByTestId(
      "subcategories",
    ) as HTMLInputElement;

    await userEvent.type(inputSubcategories, "Сервис");

    fireEvent.keyDown(inputSubcategories, {
      key: "Enter",
      code: "Enter",
      charCode: 13,
    });

    expect(inputSubcategories.value).toBe("");

    await userEvent.type(inputSubcategories, "Заправка");

    fireEvent.keyDown(inputSubcategories, {
      key: "Enter",
      code: "Enter",
      charCode: 13,
    });

    expect(screen.queryAllByTestId("subcategory-value").length).toBe(2);

    await userEvent.click(screen.getByTestId("subcategory-0"));

    expect(screen.queryAllByTestId("subcategory-value").length).toBe(1);

    await userEvent.type(
      screen.getByTestId("description"),
      "Расходы на машину!",
    );

    await userEvent.click(screen.getByText("Create"));

    expect(screen.queryAllByTestId("newCategory").length).toBe(1);
    expect(screen.queryAllByTestId("newSubcategory").length).toBe(1);

    await userEvent.click(screen.getByTestId("deleteCategory-0"));

    expect(store.getState().categories.length).toBe(0);
    expect(store.getState().expenses.length).toBe(1);
    expect(screen.queryAllByTestId("newCategory").length).toBe(0);
    expect(screen.queryAllByTestId("newSubcategory").length).toBe(0);
  });
});
