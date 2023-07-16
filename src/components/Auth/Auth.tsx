import React, { FC, FormEvent, useMemo, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { auth, categoryStorage, expenseStorage, userProfileStorage } from "../../model/storage";
import { logIn } from "../../store/slices/sliceAuth";
import "./Auth.css";
import { addUser } from "../../store/slices/sliceUser";
import { addCategories } from "../../store/slices/sliceCategories";
import { addExpenses } from "../../store/slices/sliceExpenses";

type IMode = "login" | "signup";

interface IProps {
  mode: IMode;
}

const Auth: FC<IProps> = ({ mode }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [error, setError] = useState({ state: false, message: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isRepeatPasswordNotMatch = useMemo(
    () => password !== passwordRepeat,
    [password, passwordRepeat],
  );

  const onFormSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (mode === "login") {
      signInWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
          const { user } = userCredential;
          localStorage.setItem("@djess-v/cost-management", user.uid);
          const profile = await userProfileStorage.getUserProfile(user.uid);

          if (profile) {
            dispatch(logIn());
            dispatch(addUser({ userId: profile.userId, name: profile.name }));
            
            const categories = await categoryStorage.getAll(profile.userId);

            if (categories) {
              dispatch(addCategories(categories));
            }

            const expenses = await expenseStorage.getAll(profile.userId);

            if (expenses) {
              dispatch(addExpenses(expenses));
            }

            navigate("/");
          }
        })
        .catch((err) => {
          setError({
            state: true,
            message: "No user with this data was found! Register!",
          });
        });
    } else {
      createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
          const { user } = userCredential;
          localStorage.setItem("@djess-v/cost-management", user.uid);
          dispatch(logIn());
          dispatch(addUser({ userId: user.uid, name }));
          const userId = await userProfileStorage.createUserProfile(
            user.uid,
            name,
          );

          if (userId) {

            const categories = await categoryStorage.getAll(userId);

            if (categories) {
              dispatch(addCategories(categories));
            }

            const expenses = await expenseStorage.getAll(userId);

            if (expenses) {
              dispatch(addExpenses(expenses));
            }

            navigate("/");
          } else {
            throw new Error(
              "Something went wrong with the profile creation! Try again!",
            );
          }
        })
        .catch((err: Error) => {
          setError({
            state: true,
            message: err.message,
          });
        });
    }
  };

  const clearForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setPasswordRepeat("");
    setError({ state: false, message: "" });
  };

  return (
    <div className="_container">
      <div className="auth">
        <h1 className="auth__title">
          {mode === "login" ? "Log In" : "Sign up"}
        </h1>
        <form
          className="auth__form form-auth"
          onSubmit={onFormSubmit}
          name="form-auth"
        >
          {mode === "signup" && (
            <>
              <label className="auth__form_label" htmlFor="name">
                Name:
              </label>
              <input
                className="auth__form_input _input"
                onChange={(e) => setName(e.target.value)}
                value={name}
                name="name"
                id="name"
                minLength={3}
                required
              />
            </>
          )}
          <label className="auth__form_label" htmlFor="email">
            E-mail:
          </label>
          <input
            className="auth__form_input _input"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            name="email"
            id="email"
            minLength={3}
            required
          />
          <label className="auth__form_label" htmlFor="password">
            Password:
          </label>
          <input
            className="auth__form_input _input"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            name="password"
            id="password"
            minLength={6}
            required
          />

          {mode === "signup" && (
            <>
              <label className="auth__form_label" htmlFor="repeat-password">
                Repeat password:
              </label>
              <input
                className="auth__form_input _input"
                type="password"
                onChange={(e) => setPasswordRepeat(e.target.value)}
                value={passwordRepeat}
                name="repeatPassword"
                id="repeat-password"
                minLength={6}
                required
              />
            </>
          )}

          {mode === "signup" && isRepeatPasswordNotMatch && (
            <p className="auth__form_error">Passwords do not match</p>
          )}

          {error.state && <p className="auth__form_error">{error.message}</p>}

          <div className="form-auth__buttons">
            <button
              className="form-auth__buttons_button _button"
              type="button"
              onClick={clearForm}
            >
              Clear form
            </button>

            <button
              className="form-auth__buttons_button _button"
              type="submit"
              disabled={mode === "signup" && isRepeatPasswordNotMatch}
            >
              {mode === "signup" ? "Create" : "Log in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Auth;
