import styles from "./profile.module.scss";
import classNames from "classnames/bind";
import { useRef } from "react";
import { useInView } from "framer-motion";

const cx = classNames.bind(styles);

function Chacracter({ data = {} }) {
  const ref = useRef(null);

  const isInView = useInView(ref, { once: false });
  return (
    <div className={cx("profile")} key={data.title} ref={ref}>
      <div className={cx("large-img-box")}>
        <img className={cx("large-img")} src={data.avatar} />
      </div>
      <div className={cx("pro-des")}>
        <h3
          className={cx("title")}
          style={{
            transform: isInView ? "none" : "translateY(60px)",
            opacity: isInView ? 1 : 0,
            transition: "all 1.5s cubic-bezier(0.17, 0.55, 0.55, 1)",
          }}
        >
          {data.title}
        </h3>
        <p
          className={cx("name")}
          style={{
            transform: isInView ? "none" : "translateY(60px)",
            opacity: isInView ? 1 : 0,
            transition: "all 1.5s cubic-bezier(0.17, 0.55, 0.55, 1) 0.3s",
          }}
        >
          {data.name}
        </p>
        <div
          className={cx("imgs")}
          style={{
            transform: isInView
              ? "none"
              : data.title === "groom"
              ? "translateX(-150px)"
              : "translateX(150px)",
            opacity: isInView ? 1 : 0,
            transition: "all 1.5s cubic-bezier(0.17, 0.55, 0.55, 1)",
          }}
        >
          {data.images.map((img, index) => {
            return (
              <div className={cx("small-img-box")} key={index}>
                <img className={cx("small-img")} key={index} src={img} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Chacracter;
