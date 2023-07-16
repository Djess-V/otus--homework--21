import React, { FC, useMemo, useEffect, useState } from "react";
import {
  Route,
  NavLink,
  useNavigate,
  useLocation,
  Routes,
} from "react-router-dom";
import { Chart } from "react-google-charts";
import { DateRangePicker, RangeKeyDict } from "react-date-range";
import { ru } from "date-fns/locale";
// import alasql from "alasql";
import { useDispatch, useSelector } from "react-redux";
import { v4 } from "uuid";
// import { SET_EXPENSES_FILTERS } from "../../services/actions";
// import { serializeQuery, deserializeQuery } from "../../utils/api";
import { RootState } from "../../store/store";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default";
import "./Report.css";

const initialKey = v4();

const initialRange: RangeKeyDict = {
  [initialKey]: {
    startDate: new Date(),
    endDate: new Date(),
    key: initialKey,
  }  
};

const Report: FC = () => {  
  const [ range, setRange ] = useState(initialRange);

  const dispatch = useDispatch();
  const history = useNavigate();
//   const { search } = useLocation();

  const expenses = useSelector(
    (store: RootState) => store.expenses);

//   const filterdExpenses = useMemo(
//     () =>
//       expenses.filter((expense) => {
//         const date = new Date(expense.date);
//         return (
//           (!range.startDate || date >= range.startDate) &&
//           (!range.endDate || date <= range.endDate)
//         );
//       }),
//     [expenses, range]
//   );

//   useEffect(() => {
//     if (search) {
//       let start;
//       let end;
//       Object.entries(deserializeQuery(search)).forEach(([key, value]) => {
//         if (key === "start") {
//           start = new Date(value);
//         }
//         if (key === "end") {
//           end = new Date(value);
//         }
//       });
//       dispatch({
//         type: SET_EXPENSES_FILTERS,
//         payload: {
//           startDate: start || range.startDate,
//           endDate: end || range.endDate,
//         },
//       });
//     }
//   }, [search, dispatch]);

//   useEffect(() => {
//     const query = serializeQuery({
//       start: range.startDate,
//       end: range.endDate,
//     });
//     if (query) {
//       history.replace({ search: query });
//     } else {
//       history.replace({ search: "" });
//     }
//   }, [range, history, search]);

  const handleSelect = (selectedRange: RangeKeyDict) => {
    console.dir(selectedRange);
    setRange(selectedRange);
    // dispatch({
    //   type: SET_EXPENSES_FILTERS,
    //   payload: selectedRange.range1,
    // });
  };

//   const aggrPieChartData = useMemo(() => {
//     const header = ["Категория", "Сумма"];
//     const rows = alasql(
//       `
//     SELECT category, SUM(amount) as amount
//     FROM ? 
//     GROUP BY category
//     ORDER BY SUM(amount) DESC`,
//       [filterdExpenses]
//     ).map((el: [string, string, number][]) => Object.values(el));
//     const data = [header, ...rows];
//     return data;
//   }, [filterdExpenses]);

//   const aggrTableData = useMemo(() => {
//     const header = ["Категория", "Подкатегория", "Сумма"];
//     const rows = alasql(
//       `
//     SELECT category , subcategory, SUM(amount) as amount
//     FROM ? 
//     GROUP BY category, subcategory
//     ORDER BY SUM(amount) DESC`,
//       [filterdExpenses]
//     ).map((el: [string, string, number][]) => Object.values(el));
//     const data = [header, ...rows];
//     return data;
//   }, [filterdExpenses]);

  return (
    <div className="_container">
      <div className="report">
        <h1 className="report__title">Expenses:</h1>
        <nav className="report__nav nav-report">
            <ul className="nav-report__list list-nav-report">
                <li className="list-nav-report__item">
                    <NavLink
                        className="list-nav-report__item_link"
                        to="table"
                    >
                        Table
                    </NavLink>
                </li>
                <li className="nav-report__list_item">
                    <NavLink
                        className="list-nav-report__item_link"
                        to="chart"
                    >
                        Pie chart
                    </NavLink>
                </li>
            </ul>
        </nav>
        <DateRangePicker
            locale={ru}
            ranges={[range]}
            onChange={handleSelect}
            direction="horizontal"
        />
        <Routes>
        <Route path="table" element={
            <Chart
            chartType="Table"
            loader={<div className="report__loader">Visualization loading...</div>}
            /* data={aggrTableData} */
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
                        controlProp.controlID === "select-category"
                    )}
                    </div>
                    <div className="report__table-filters_filter">
                    {renderControl(
                        ({ controlProp }) =>
                        controlProp.controlID === "select-subcategory"
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
        } />          

        <Route path="chart" element={
            <Chart
            className="report__pie-chart"
            chartType="PieChart"
            loader={<div className="report__loader">Visualization loading...</div>}
            /* data={aggrPieChartData} */
            options={{
                title: "Expenses",
            }}
            />
        } />
         
        </Routes>
                
      </div>      
    </div>
  );
}

export default Report;