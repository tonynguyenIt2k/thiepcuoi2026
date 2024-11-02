import classNames from "classnames/bind";
import styles from "./information.module.scss";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaPhone } from "react-icons/fa6";
import { useInView } from "framer-motion";
import { useRef } from "react";
import House from "@/app/icons/house";

const cx = classNames.bind(styles);

function Infomation({
  className,
  img = "",
  time = "",
  address = "",
  street = "",
  phone = "",
}) {
  const boxRef = useRef();
  const boxInView = useInView(boxRef, { once: true });
  return (
    <div className={cx("wrapper")} ref={boxRef}>
      <House className={cx("house")} />

      <p className={cx("date")}>
        <span
          className={cx("date-detail")}
          style={{
            transform: boxInView ? "none" : "translateY(150px)",
            opacity: boxInView ? 1 : 0,
            transition: "all 1.5s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s",
          }}
        >
          {time.date}
        </span>
        <span
          className={cx("date-detail")}
          style={{
            transform: boxInView ? "none" : "translateY(150px)",
            opacity: boxInView ? 1 : 0,
            transition: "all 1.5s cubic-bezier(0.17, 0.55, 0.55, 1) 1s",
          }}
        >
          {time.year}
        </span>
        <span
          className={cx("date-detail")}
          style={{
            transform: boxInView ? "none" : "translateY(150px)",
            opacity: boxInView ? 1 : 0,
            transition: "all 1.5s cubic-bezier(0.17, 0.55, 0.55, 1) 1.5s",
          }}
        >
          {time.time}
        </span>
      </p>

      <div className={cx("address")}>{address}</div>
      <a className={cx("btn", "ani-btn")} href={`tel:${phone}`}>
        <FaPhone className={cx("icon")} />
        {phone}
      </a>
      <a
        className={cx("btn")}
        href={`http://maps.google.com/?q=${street}`}
        target="_blank"
      >
        <FaMapMarkerAlt className={cx("icon")} />
        Đường đi
      </a>
    </div>
  );
}

export default Infomation;
