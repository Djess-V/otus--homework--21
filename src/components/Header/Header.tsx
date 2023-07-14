import React, { FC } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux/es/exports";
import { RootState } from "../../store/store";
import "./Header.css";
import { logOut } from "../../store/slices/sliceAuth";
import { deleteUser } from "../../store/slices/sliceUser";

const Header: FC = () => {
  const location = useLocation();
  const auth = useSelector((store: RootState) => store.auth);
  const dispatch = useDispatch();

  const handleSignOut = () => {
    dispatch(logOut());
    dispatch(deleteUser());
    localStorage.setItem("@djess-v/cost-management", "");
  };

  return (
    <div className="header">
      <div className="header__container header-container _container">
        <Link className="header-container__title" to="/">
          Cost management
        </Link>
        <nav className="header-container__nav nav-header">
          {auth && (
            <>
              <Link
                className={`nav-header__link ${
                  location.pathname === "/expenses"
                    ? "nav-header__link_active"
                    : ""
                }`}
                to="/expenses"
              >
                EXPENSES
              </Link>
              <Link
                className={`nav-header__link ${
                  location.pathname === "/setting"
                    ? "nav-header__link_active"
                    : ""
                }`}
                to="/setting"
              >
                SETTING
              </Link>
              <Link
                className={`nav-header__link ${
                  location.pathname === "/report"
                    ? "nav-header__link_active"
                    : ""
                }`}
                to="/report"
              >
                REPORT
              </Link>
            </>
          )}
          <Link
            className={`nav-header__link ${
              location.pathname === "/about" ? "nav-header__link_active" : ""
            }`}
            to="/about"
          >
            ABOUT
          </Link>
          {!auth && (
            <>
              <Link
                className={`nav-header__link ${
                  location.pathname === "/login"
                    ? "nav-header__link_active"
                    : ""
                }`}
                to="/login"
              >
                LOG IN
              </Link>
              <Link
                className={`nav-header__link ${
                  location.pathname === "/signup"
                    ? "nav-header__link_active"
                    : ""
                }`}
                to="/signup"
              >
                SIGN UP
              </Link>
            </>
          )}
          {auth && (
            <Link className={`nav-header__link`} to="/" onClick={handleSignOut}>
              SIGN OUT
            </Link>
          )}
        </nav>
      </div>
    </div>
  );
};

export default Header;
