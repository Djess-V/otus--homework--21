import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "../Header/Header";
import Home from "../Home/Home";
import Auth from "../Auth/Auth";
import About from "../About/About";
import Setting from "../Setting/Setting";
import Expenses from "../Expenses/Expenses";
import "./App.css";
import Reports from "../Reports/Reports";
import ReportTable from "../Reports/Table/ReportTable";
import ReportPieChart from "../Reports/PieChart/ReportPieChart";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/otus--homework--21/" element={<Header />}>
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
