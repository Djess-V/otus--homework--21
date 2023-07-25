import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Home from "./components/Home/Home";
import Auth from "./components/Auth/Auth";
import About from "./components/About/About";
import Setting from "./components/Setting/Setting";
import Expenses from "./components/Expenses/Expenses";
import Reports from "./components/Reports/Reports";
import ReportTable from "./components/Reports/Table/ReportTable";
import ReportPieChart from "./components/Reports/PieChart/ReportPieChart";
import "./App.css";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path={`${PREFIX}/`} element={<Header />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="login" element={<Auth mode="login" />} />
        <Route path="signup" element={<Auth mode="signup" />} />
        <Route path="setting" element={<Setting />} />
        <Route path="expenses" element={<Expenses />} />
        <Route path="reports" element={<Reports />}>
          <Route path="table" element={<ReportTable />} />
          <Route path="chart" element={<ReportPieChart />} />
        </Route>
      </Route>
    </Routes>
  </BrowserRouter>
);

export default App;
