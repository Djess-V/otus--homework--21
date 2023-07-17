import React, { FC } from "react";
import Chart from "react-google-charts";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { prepareDataForReport } from "../../../services/prepareDataForReport";
import "./ReportTable.css";

const ReportTable: FC = () => {
  const expenses = useSelector((store: RootState) => store.expenses);
  const categories = useSelector((store: RootState) => store.categories);
  const range = useSelector((store: RootState) => store.range);

  const aggrTableData = () => {
    const header = ["Category", "Subcategory", "Amount"];
    const data = [
      header,
      ...prepareDataForReport("table", expenses, range, categories),
    ];

    return data;
  };

  return (
    <Chart
      chartType="Table"
      width="100%"
      data={aggrTableData()}
      options={{
        allowHtml: true,
        showRowNumber: true,
      }}
      render={({ renderControl, renderChart }) => (
        <div className="report__table-container">
          <div className="report__table-filters">
            <div className="report__table-filters_filter">
              {renderControl(
                ({ controlProp }) =>
                  controlProp.controlID === "select-category",
              )}
            </div>
            <div className="report__table-filters_filter">
              {renderControl(
                ({ controlProp }) =>
                  controlProp.controlID === "select-subcategory",
              )}
            </div>
          </div>
          <div className="report__table-chart">{renderChart()}</div>
        </div>
      )}
      controls={[
        {
          controlType: "CategoryFilter",
          controlID: "select-category",
          options: {
            filterColumnIndex: 0,
            ui: {
              labelStacking: "vertical",
              label: "Category:",
              allowTyping: false,
              allowMultiple: true,
            },
          },
        },
        {
          controlType: "CategoryFilter",
          controlID: "select-subcategory",
          options: {
            filterColumnIndex: 1,
            ui: {
              labelStacking: "vertical",
              label: "Subcategory:",
              allowTyping: false,
              allowMultiple: true,
            },
          },
        },
      ]}
    />
  );
};

export default ReportTable;
