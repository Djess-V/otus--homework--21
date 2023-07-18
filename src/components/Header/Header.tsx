import React, { FC } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { deleteUser } from "../../store/slices/sliceUser";
import { serializeQuery } from "../../services/serviceFunctions";
import { updateRange } from "../../store/slices/sliceRange";
import { deleteCategories } from "../../store/slices/sliceCategories";
import { deleteExpenses } from "../../store/slices/sliceExpenses";
import "./Header.css";

const now = new Date().getTime();

const Header: FC = () => {
  const location = useLocation();
  const user = useSelector((store: RootState) => store.user);
  const range = useSelector((store: RootState) => store.range);
  const dispatch = useDispatch();

  const query = serializeQuery(range);

  const handleSignOut = () => {
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
          <Link className="header-container__title" to={`${PREFIX}/`}>
            Cost management
          </Link>
          <nav className="header-container__nav nav-header">
            {user.userId && (
              <>
                <Link
                  className={`nav-header__link ${
                    location.pathname.includes("/expenses")
                      ? "nav-header__link_active"
                      : ""
                  }`}
                  to={`${PREFIX}/expenses`}
                >
                  EXPENSES
                </Link>
                <Link
                  className={`nav-header__link ${
                    location.pathname.includes("/setting")
                      ? "nav-header__link_active"
                      : ""
                  }`}
                  to={`${PREFIX}/setting`}
                >
                  CATEGORIES
                </Link>
                <Link
                  className={`nav-header__link ${
                    location.pathname.includes("/reports")
                      ? "nav-header__link_active"
                      : ""
                  }`}
                  to={`${PREFIX}/reports${query}`}
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
              to={`${PREFIX}/about`}
            >
              ABOUT
            </Link>
            {!user.userId && (
              <>
                <Link
                  className={`nav-header__link ${
                    location.pathname.includes("/login")
                      ? "nav-header__link_active"
                      : ""
                  }`}
                  to={`${PREFIX}/login`}
                >
                  LOG IN
                </Link>
                <Link
                  className={`nav-header__link ${
                    location.pathname.includes("/signup")
                      ? "nav-header__link_active"
                      : ""
                  }`}
                  to={`${PREFIX}/signup`}
                >
                  SIGN UP
                </Link>
              </>
            )}
            {user.userId && (
              <Link
                className={`nav-header__link`}
                to={`${PREFIX}/`}
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
