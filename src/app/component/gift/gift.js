import { bank } from "@/app/configs/ui";
import styles from "./gift.module.scss";
import classNames from "classnames/bind";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { IoClose } from "react-icons/io5";
import images from "@/app/images";
const cx = classNames.bind(styles);

function Gift({ onClose }) {
  const viewRef = useRef();
  const isInView = useInView(viewRef, { once: true });
  return (
    <div className={cx("wrapper")} ref={viewRef}>
      <span className={cx("icon-wrap")} onClick={onClose}>
        <IoClose className={cx("icon")} />
      </span>

      <div className={cx("img-box")}>
        <div className={cx("img")}></div>
        <p className={cx("text")}>Thanks</p>
      </div>

      <div className={cx("bank")}>
        <img
          src={images.qr.default.src}
          className={cx("qr-code")}
          style={{
            transform: isInView ? "translateX(0)" : "translateX(-150px)",
            opacity: isInView ? 1 : 0,
            transition: "all 1s cubic-bezier(0.17, 0.55, 0.55, 1)",
          }}
        />
        <div
          className={cx("info")}
          style={{
            transform: isInView ? "translateX(0)" : "translateX(150px)",
            opacity: isInView ? 1 : 0,
            transition: "all 1s cubic-bezier(0.17, 0.55, 0.55, 1)",
          }}
        >
          <h2 className={cx("title")}>Mừng cưới</h2>
          <p className={cx("name")}>{bank.name}</p>
          <p className={cx("bank-name")}>{bank.bankName}</p>
          <p className={cx("bank-number")}>{bank.bankNumber}</p>
        </div>
      </div>
    </div>
  );
}

export default Gift;
