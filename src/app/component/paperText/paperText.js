import classNames from "classnames/bind";
import styles from "./paperText.module.scss";
import images from "@/app/images";

const cx = classNames.bind(styles);
function PaperText({ children, className }) {
  return (
    <div className={cx("wrapper")}>
      <p className={cx("text", className)}>{children}</p>
      <img className={cx("heart")} src={images.heart.default.src} />
    </div>
  );
}

export default PaperText;
