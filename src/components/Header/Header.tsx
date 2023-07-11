import React, { FC } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Header.css";

const Header: FC = () => {
  const location = useLocation();

  return (
    <div className="header">
      <div className="header__container header-container _container">
        <Link className="header-container__title" to="/">
          Cost management
        </Link>
        <nav className="header-container__nav nav-header">
          <Link
            className={`nav-header__link ${
              location.pathname === "/login" ? "nav-header__link_active" : ""
            }`}
            to="/login"
          >
            LOG IN
          </Link>
          <Link
            className={`nav-header__link ${
              location.pathname === "/signup" ? "nav-header__link_active" : ""
            }`}
            to="/signup"
          >
            SIGN UP
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default Header;
