import React, { FC, FormEvent, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useDispatch } from "react-redux";
import { NavigateFunction, useNavigate } from "react-router-dom";
import {
  auth,
  categoryStorage,
  expenseStorage,
  userProfileStorage,
} from "../../model/storage";
import "./Auth.css";
import { addUser } from "../../store/slices/sliceUser";
import { addCategories } from "../../store/slices/sliceCategories";
import { addExpenses } from "../../store/slices/sliceExpenses";
import { IUserProfile } from "../../model/userProfile/FirebaseUserProfileModel";
import { AppDispatch } from "../../store/store";

type IMode = "login" | "signup";

interface IRegData {
  name: string;
  email: string;
  password: string;
  passwordRepeat: string;
}

interface IProps {
  mode: IMode;
}

const initialRegData: IRegData = {
  name: "",
  email: "",
  password: "",
  passwordRepeat: "",
};

const supportObj = {
  login: signInWithEmailAndPassword,
  signup: createUserWithEmailAndPassword,
};

function saveIDToLocalStorage(id: string) {
  localStorage.setItem("@djess-v/cost-management", id);
}

async function getInitialDataForStore(id: string, dispatch: AppDispatch) {
  const categories = await categoryStorage.getAll(id);

  if (categories) {
    dispatch(addCategories(categories));
  }

  const expenses = await expenseStorage.getAll(id);

  if (expenses) {
    dispatch(addExpenses(expenses));
  }
}

async function authentication(
  mode: IMode,
  regData: IRegData,
  errorCb: React.Dispatch<
    React.SetStateAction<{
      state: boolean;
      message: string;
    }>
  >,
  dispatch: AppDispatch,
  navigate: NavigateFunction,
) {
  try {
    let profile: IUserProfile | null = null;

    const { user } = await supportObj[mode](
      auth,
      regData.email,
      regData.password,
    );

    if (mode === "login") {
      profile = await userProfileStorage.getUserProfile(user.uid);
    } else {
      profile = await userProfileStorage.createUserProfile(
        user.uid,
        regData.name,
      );
    }

    if (profile) {
      saveIDToLocalStorage(profile.userId);
      dispatch(addUser(profile));

      getInitialDataForStore(profile.userId, dispatch);
    }

    navigate(`${PREFIX}/`);
  } catch (error) {
    errorCb({
      state: true,
      message: (error as unknown as Error).message,
    });
  }
}

const Auth: FC<IProps> = ({ mode }) => {
  const [regData, setRegData] = useState(initialRegData);
  const [error, setError] = useState({ state: false, message: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isRepeatPasswordNotMatch = regData.password !== regData.passwordRepeat;

  const onFormSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await authentication(mode, regData, setError, dispatch, navigate);
  };

  const clearForm = () => {
    setRegData({ ...initialRegData });
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
                onChange={(e) =>
                  setRegData({ ...regData, name: e.target.value })
                }
                value={regData.name}
                name="name"
                id="name"
                minLength={3}
                required
                data-testid="name"
              />
            </>
          )}
          <label className="auth__form_label" htmlFor="email">
            E-mail:
          </label>
          <input
            className="auth__form_input _input"
            type="email"
            onChange={(e) => setRegData({ ...regData, email: e.target.value })}
            value={regData.email}
            name="email"
            id="email"
            minLength={3}
            required
            data-testid="email"
          />
          <label className="auth__form_label" htmlFor="password">
            Password:
          </label>
          <input
            className="auth__form_input _input"
            type="password"
            onChange={(e) =>
              setRegData({ ...regData, password: e.target.value })
            }
            value={regData.password}
            name="password"
            id="password"
            minLength={6}
            required
            data-testid="password"
          />

          {mode === "signup" && (
            <>
              <label className="auth__form_label" htmlFor="repeat-password">
                Repeat password:
              </label>
              <input
                className="auth__form_input _input"
                type="password"
                onChange={(e) =>
                  setRegData({ ...regData, passwordRepeat: e.target.value })
                }
                value={regData.passwordRepeat}
                name="repeatPassword"
                id="repeat-password"
                minLength={6}
                required
                data-testid="repeatPassword"
              />
              {isRepeatPasswordNotMatch && (
                <p className="auth__form_error" data-testid="error">
                  Passwords do not match
                </p>
              )}
            </>
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
