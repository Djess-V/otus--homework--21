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
    set: jest.fn(() => Promise.resolve(true)),
    ref: jest.fn(() => true),
    child: jest.fn(() => true),
    get: jest
      .fn()
      .mockImplementationOnce(() =>
        Promise.resolve({
          exists: () => true,
          val: () => ({
            foo: {
              id: "string",
              name: "string",
              subcategories: {
                baz: {
                  id: "string",
                  name: "string",
                },
              },
              description: "string",
            },
          }),
        }),
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          exists: () => true,
          val: () => ({
            foo: {
              id: "string",
              date: 145627892,
              categoryId: "string",
              subcategoryId: "string",
              amount: 1000,
            },
          }),
        }),
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          exists: () => true,
          val: () => ({
            userId: "string",
            name: "string",
          }),
        }),
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          exists: () => true,
          val: () => ({
            foo: {
              id: "string",
              name: "string",
              subcategories: {
                baz: {
                  id: "string",
                  name: "string",
                },
              },
              description: "string",
            },
          }),
        }),
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          exists: () => true,
          val: () => ({
            foo: {
              id: "string",
              date: 145627892,
              categoryId: "string",
              subcategoryId: "string",
              amount: 1000,
            },
          }),
        }),
      ),
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

    expect(store.getState().user.userId).toBe("fooBaz");
    expect(store.getState().user.name).toBe("Евгений");
    expect(store.getState().expenses.length).toBe(1);
    expect(store.getState().categories.length).toBe(1);
  });

  it("render component in mode - login, auth fullfiled", async () => {
    render(
      <MemoryRouter>
        <Provider store={store}>
          <Auth mode="login" />
        </Provider>
      </MemoryRouter>,
    );

    expect(screen.getByText("Log In")).toBeInTheDocument();

    fireEvent.change(screen.getByTestId("email"), {
      target: { value: "Hello@yandex.ru" },
    });

    fireEvent.change(screen.getByTestId("password"), {
      target: { value: "World!" },
    });

    await userEvent.click(screen.getByText("Log in"));

    expect(store.getState().user.userId).toBe("string");
    expect(store.getState().user.name).toBe("string");
    expect(store.getState().expenses.length).toBe(1);
    expect(store.getState().categories.length).toBe(1);
  });
});
