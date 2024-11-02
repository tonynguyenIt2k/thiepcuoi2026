import classNames from "classnames/bind";
import styles from "./paperText.module.scss";

const cx = classNames.bind(styles);
function PaperText({ children, className }) {
  return <p className={cx("wrapper", className)}>{children}</p>;
}

export default PaperText;
