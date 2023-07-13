import React, { FC } from "react";
import { useSelector } from "react-redux/es/exports";
import "./Home.css";
import { RootState } from "../../store/store";

const Home: FC = () => {
  const user = useSelector((store: RootState) => store.user);

  return (
    <div className="_container">
      <div className="home">
        <h2>{`Welcome${"name" in user ? `, ${user.name}` : ""}!`}</h2>
        <h3>Use the links at the top of the app for further work.</h3>
      </div>
    </div>
  );
};

export default Home;
