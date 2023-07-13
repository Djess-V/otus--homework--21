import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import App from "./components/App/App";
import store from "./store/store";
import "./default.css";
import { logIn } from "./store/slices/sliceAuth";
import { categoryStorage, userProfileStorage } from "./model/storage";
import { addUser } from "./store/slices/sliceUser";
import { addCategories } from "./store/slices/sliceCategories";

// localStorage.setItem("@djess-v/cost-management", "");
const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);
root.render(
  <Provider store={store}>
    <App />
  </Provider>,
);

window.addEventListener("load", async () => {
  try {
    const userId = localStorage.getItem("@djess-v/cost-management");

    if (userId) {
      const profile = await userProfileStorage.getUserProfile(userId);

      if (profile) {
        store.dispatch(logIn());
        store.dispatch(addUser({ userId: profile.userId, name: profile.name }));
      } else {
        throw new Error(
          "User with given Id from LocalStorage is not found in FireBase",
        );
      }

      const categories = await categoryStorage.getAll(userId);

      if (categories) {
        store.dispatch(addCategories(categories));
      }
    }
  } catch (e) {
    console.log((e as Error).message);
  }
});
