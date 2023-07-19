import React from "react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import Auth from "./Auth";
import store from "../../store/store";

jest.mock("firebase/auth", () => {
  const originalModule = jest.requireActual("firebase/auth");

  return {
    __esModule: true,
    ...originalModule,
    signInWithEmailAndPassword: jest.fn(() =>
      Promise.resolve({ user: { uid: "fooBaz" } }),
    ),
    createUserWithEmailAndPassword: jest.fn(() =>
      Promise.resolve({ user: { uid: "fooBaz" } }),
    ),
  };
});

jest.mock("firebase/database", () => {
  const originalModule = jest.requireActual("firebase/database");

  return {
    __esModule: true,
    ...originalModule,
    set: jest.fn(() => Promise.reject()),
    ref: jest.fn(() => true),
  };
});

describe("Auth without errors", () => {
  it("render component in mode - signup, auth fullfiled", async () => {
    render(
      <MemoryRouter>
        <Provider store={store}>
          <Auth mode="signup" />
        </Provider>
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByTestId("name"), {
      target: { value: "Евгений" },
    });

    fireEvent.change(screen.getByTestId("email"), {
      target: { value: "Hello@yandex.ru" },
    });

    fireEvent.change(screen.getByTestId("password"), {
      target: { value: "World!" },
    });

    fireEvent.change(screen.getByTestId("repeatPassword"), {
      target: { value: "World!" },
    });

    await userEvent.click(screen.getByText("Create"));

    expect(
      screen.getByText(
        "Something went wrong with the profile creation! Try again!",
      ),
    ).not.toBeNull();
  });
});
