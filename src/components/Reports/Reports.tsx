import React, { FC, useEffect } from "react";
import { Link, useNavigate, useLocation, Outlet } from "react-router-dom";
import { DateRangePicker, RangeKeyDict } from "react-date-range";
import { ru } from "date-fns/locale";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import {
  deserializeQuery,
  serializeQuery,
} from "../../services/serviceFunctions";
import { updateRange } from "../../store/slices/sliceRange";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default";
import "./Reports.css";

const Reports: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const range = useSelector((store: RootState) => store.range);

  const selectedRange = {
    startDate: new Date(range.startDate),
    endDate: new Date(range.endDate),
  };

  useEffect(() => {
    if (location.search) {
      let start: undefined | number;
      let end: undefined | number;
      Object.entries(deserializeQuery(location.search)).forEach(
        ([key, value]) => {
          if (key === "startDate") {
            start = new Date(value).getTime();
          }
          if (key === "endDate") {
            end = new Date(value).getTime();
          }
        },
      );
      dispatch(
        updateRange({
          startDate: start || range.startDate,
          endDate: end || range.endDate,
        }),
      );
    }
  }, []);

  const handleSelect = (selectRange: RangeKeyDict) => {
    Object.keys(selectRange).forEach((key, i) => {
      if (i === 0) {
        const now = new Date().getTime();
        const start = selectRange[key].startDate;
        const end = selectRange[key].endDate;

        const newRange = {
          startDate: start ? start.getTime() : now,
          endDate: end ? end.getTime() : now,
        };

        dispatch(updateRange(newRange));

        const query = serializeQuery(newRange);

        if (location.pathname.includes("/reports/table")) {
          navigate(`/otus--homework--21/reports/table${query}`, {
            replace: true,
          });
        } else if (location.pathname.includes("/reports/chart")) {
          navigate(`/otus--homework--21/reports/chart${query}`, {
            replace: true,
          });
        } else {
          navigate(`/otus--homework--21/reports${query}`, { replace: true });
        }
      }
    });
  };

  return (
    <div className="_container">
      <div className="report">
        <h2 className="report__title">Select a range, then select a report!</h2>
        <DateRangePicker
          locale={ru}
          ranges={[selectedRange]}
          onChange={handleSelect}
          direction="horizontal"
        />

        <nav className="report__nav nav-report">
          <ul className="nav-report__list list-nav-report">
            <li className="list-nav-report__item">
              <Link
                className="list-nav-report__item_link"
                to={`table${location.search}`}
              >
                Table
              </Link>
            </li>
            <li className="nav-report__list_item">
              <Link
                className="list-nav-report__item_link"
                to={`chart${location.search}`}
              >
                Pie chart
              </Link>
            </li>
          </ul>
        </nav>

        <Outlet />
      </div>
    </div>
  );
};

export default Reports;
