import classNames from "classnames/bind";
import styles from "./loading.module.scss";

const cx = classNames.bind(styles);

function Loading() {
  return (
    <div className={cx("wrapper")}>
      <div className={cx("back")}></div>
      <div className={cx("heart")}></div>
    </div>
  );
}

export default Loading;
