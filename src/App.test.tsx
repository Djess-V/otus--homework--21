import React from "react";
import { Provider } from "react-redux";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { v4 } from "uuid";
import userEvent from "@testing-library/user-event";
import App from "./App";
import store from "./store/store";
import { addUser, deleteUser } from "./store/slices/sliceUser";
import { addCategories } from "./store/slices/sliceCategories";
import { addExpenses } from "./store/slices/sliceExpenses";

const sleep = (x: number) =>
  new Promise((r) => {
    setTimeout(r, x);
  });

describe("App", () => {
  it("render component", async () => {
    const user = userEvent.setup();

    store.dispatch(addUser({ userId: v4(), name: "Евгений" }));
    store.dispatch(
      addCategories([
        {
          id: "string",
          name: "Машина",
          description: "string",
          subcategories: [
            {
              id: "string1",
              name: "Заправка",
            },
            {
              id: "string2",
              name: "Сервис",
            },
          ],
        },
      ]),
    );
    store.dispatch(
      addExpenses([
        {
          id: "string5",
          categoryId: "string",
          subcategoryId: "string1",
          amount: 1000,
          date: 1689745034257,
        },
        {
          id: "string6",
          categoryId: "string",
          subcategoryId: "string2",
          amount: 5000,
          date: 1689745000000,
        },
      ]),
    );
    const { container } = render(
      <Provider store={store}>
        <App />
      </Provider>,
    );

    await user.click(screen.getByText("REPORTS"));

    expect(
      screen.getByText("Select a range, then select a report!"),
    ).toBeInTheDocument();

    const btnThisMonth = container.getElementsByClassName("rdrStaticRange")[4];

    await user.click(btnThisMonth);

    await user.click(screen.getByText("Pie chart"));

    expect(
      container.getElementsByClassName("report__pie-chart")[0],
    ).not.toBeNull();

    await user.click(screen.getByText("Table"));

    expect(
      container.getElementsByClassName("report__table-container")[0],
    ).not.toBeNull();
  }, 10000);
});
