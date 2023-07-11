import React, { FC } from "react";
import { useSelector } from "react-redux/es/exports";
import "./Home.css";
import { RootState } from "../../store/store";

const Home: FC = () => {
  const auth = useSelector((store: RootState) => store.auth);

  return (
    <div className="_container">
      <div className="home">
        <h1>{`Welcome${"name" in auth ? `, ${auth.name}` : ""}!`}</h1>
        <h2>Use the links at the top of the app for further work.</h2>
      </div>
    </div>
  );
};

export default Home;
