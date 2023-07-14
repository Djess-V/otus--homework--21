import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import FirebaseCategoryModel from "./category/FireBaseCategoryModel";
import FirebaseExpenseModel from "./expense/FirebaseExpenseModel";
import FirebaseUserProfileModel from "./user/FirebaseUserProfileModel";

const firebaseConfig = {
  apiKey: "AIzaSyA1-VaVf6vUCiFB8BYqqHcYiJOnHs1eZ4Y",
  authDomain: "cost-management-889a4.firebaseapp.com",
  databaseURL:
    "https://cost-management-889a4-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "cost-management-889a4",
  storageBucket: "cost-management-889a4.appspot.com",
  messagingSenderId: "735773491836",
  appId: "1:735773491836:web:3e355324c34aab13cbfff9",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const userProfileStorage = new FirebaseUserProfileModel(
  db,
  "users/",
  "/profile",
);
const categoryStorage = new FirebaseCategoryModel(db, "users/", "/categories");
const expenseStorage = new FirebaseExpenseModel(db, "users/", "/expenses");

const auth = getAuth();

export { db, auth, userProfileStorage, categoryStorage, expenseStorage };
