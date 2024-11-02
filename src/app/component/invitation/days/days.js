import classNames from "classnames/bind";
import styles from "./days.module.scss";
import { daysInMonth } from "@/app/configs/ui";

const cx = classNames.bind(styles);

function Days({ title = "Month", activeDay = 12 }) {
  return (
    <div className={cx("wrapper")}>
      <h2 className={cx("title")}>{title}</h2>
      <div className={cx("calender")}>
        {daysInMonth.map((col) => {
          return (
            <div className={cx("col")} key={col.title}>
              <span className={cx("day-title")}>{col.title}</span>
              {col.days.map((day) => {
                return (
                  <span
                    className={cx(
                      "day-number",
                      activeDay === day && "active-day"
                    )}
                    key={day}
                  >
                    {day === 0 ? "" : day}
                  </span>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Days;
