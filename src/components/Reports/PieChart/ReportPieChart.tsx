import React, { FC } from "react";
import Chart from "react-google-charts";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { prepareDataForReport } from "../../../services/prepareDataForReport";
import "./ReportPieChart.css";

const header = ["Category", "Amount"];

const ReportPieChart: FC = () => {
  const expenses = useSelector((store: RootState) => store.expenses);
  const categories = useSelector((store: RootState) => store.categories);
  const range = useSelector((store: RootState) => store.range);

  const pieChartData = [
    header,
    ...prepareDataForReport("chart", expenses, range, categories),
  ];

  return (
    <Chart
      className="report__pie-chart"
      chartType="PieChart"
      data={pieChartData}
      options={{
        title: "Costs by category",
      }}
    />
  );
};

export default ReportPieChart;
