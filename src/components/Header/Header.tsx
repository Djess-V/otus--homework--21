import React, { FC } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux/es/exports";
import { RootState } from "../../store/store";
import { logOut } from "../../store/slices/sliceAuth";
import { deleteUser } from "../../store/slices/sliceUser";
import { serializeQuery } from "../../services/serviceFunctions";
import { updateRange } from "../../store/slices/sliceRange";
import { deleteCategories } from "../../store/slices/sliceCategories";
import { deleteExpenses } from "../../store/slices/sliceExpenses";
import "./Header.css";

const Header: FC = () => {
  const location = useLocation();
  const auth = useSelector((store: RootState) => store.auth);
  const range = useSelector((store: RootState) => store.range);
  const dispatch = useDispatch();

  const query = serializeQuery(range);

  const handleSignOut = () => {
    const now = new Date().getTime();

    dispatch(logOut());
    dispatch(deleteUser());
    dispatch(
      updateRange({
        startDate: now,
        endDate: now,
      }),
    );
    dispatch(deleteCategories());
    dispatch(deleteExpenses());
  };

  return (
    <>
      <div className="header">
        <div className="header__container header-container _container">
          <Link className="header-container__title" to="/otus--homework--21/">
            Cost management
          </Link>
          <nav className="header-container__nav nav-header">
            {auth && (
              <>
                <Link
                  className={`nav-header__link ${
                    location.pathname.includes("/expenses")
                      ? "nav-header__link_active"
                      : ""
                  }`}
                  to="/otus--homework--21/expenses"
                >
                  EXPENSES
                </Link>
                <Link
                  className={`nav-header__link ${
                    location.pathname.includes("/setting")
                      ? "nav-header__link_active"
                      : ""
                  }`}
                  to="/otus--homework--21/setting"
                >
                  CATEGORIES
                </Link>
                <Link
                  className={`nav-header__link ${
                    location.pathname.includes("/reports")
                      ? "nav-header__link_active"
                      : ""
                  }`}
                  to={`/otus--homework--21/reports${query}`}
                >
                  REPORTS
                </Link>
              </>
            )}
            <Link
              className={`nav-header__link ${
                location.pathname.includes("/about")
                  ? "nav-header__link_active"
                  : ""
              }`}
              to="/otus--homework--21/about"
            >
              ABOUT
            </Link>
            {!auth && (
              <>
                <Link
                  className={`nav-header__link ${
                    location.pathname.includes("/login")
                      ? "nav-header__link_active"
                      : ""
                  }`}
                  to="/otus--homework--21/login"
                >
                  LOG IN
                </Link>
                <Link
                  className={`nav-header__link ${
                    location.pathname.includes("/signup")
                      ? "nav-header__link_active"
                      : ""
                  }`}
                  to="/otus--homework--21/signup"
                >
                  SIGN UP
                </Link>
              </>
            )}
            {auth && (
              <Link
                className={`nav-header__link`}
                to="/otus--homework--21/"
                onClick={handleSignOut}
              >
                SIGN OUT
              </Link>
            )}
          </nav>
        </div>
      </div>
      <Outlet />
    </>
  );
};

export default Header;
