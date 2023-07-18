import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { v4 } from "uuid";
import Home from "./Home";
import store from "../../store/store";
import { addUser, deleteUser } from "../../store/slices/sliceUser";

describe("Home", () => {
  it("renders component for authorized users", () => {
    store.dispatch(addUser({ userId: v4(), name: "Евгений" }));

    render(
      <MemoryRouter>
        <Provider store={store}>
          <Home />
        </Provider>
      </MemoryRouter>,
    );
    expect(screen.getByText("Welcome, Евгений!")).toBeInTheDocument();
    expect(
      screen.getByText("Use the links at the top of the app for further work."),
    ).toBeInTheDocument();
  });

  it("renders component for unauthorized users", () => {
    store.dispatch(deleteUser());

    render(
      <MemoryRouter>
        <Provider store={store}>
          <Home />
        </Provider>
      </MemoryRouter>,
    );
    expect(screen.getByText("Welcome!")).toBeInTheDocument();
  });
});
