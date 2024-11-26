import { brideBank, groomBank } from "@/app/configs/ui";
import styles from "./gift.module.scss";
import classNames from "classnames/bind";
import { useInView } from "framer-motion";
import { useEffect, useRef } from "react";
import images from "@/app/images";
import CopyToClipboard from "react-copy-to-clipboard";
import { useDebounce } from "@/app/helper";
import { useState } from "react";
import Confetti from "react-dom-confetti";
import { configConfetti } from "@/app/configs/ui";
const cx = classNames.bind(styles);

function Gift({ onClose, hasNav = true }) {
  const viewRef = useRef();
  const isInView = useInView(viewRef, { once: true });
  const [isCopied, setIsCopied] = useState(false);
  const [nav, setNav] = useState("bride");

  const handleCopy = useDebounce(() => {
    setIsCopied(true);
  }, 1000);

  useEffect(() => {
    let timeout;
    if (isCopied) {
      timeout = setTimeout(() => {
        setIsCopied(false);
      }, 1000);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [isCopied]);

  return (
    <div className={cx("wrapper")}>
      {/* <span className={cx("icon-wrap")} onClick={onClose}>
        <IoClose className={cx("icon")} />
      </span> */}

      <div className={cx("header")}>
        <p className={cx("text")}>Mừng cưới</p>
      </div>

      <div className={cx("content")}>
        <img
          className={cx("img")}
          src="https://res.cloudinary.com/do6sozxbo/image/upload/v1730383598/wedding5/am3.jpg"
        />

        {hasNav && (
          <div className={cx("nav")}>
            <span
              className={cx("nav-btn", nav === "bride" && "active")}
              onClick={() => setNav("bride")}
            >
              Cô dâu
            </span>
            <span
              className={cx("nav-btn", nav === "groom" && "active")}
              onClick={() => setNav("groom")}
            >
              Chú rể
            </span>
          </div>
        )}
        {nav === "bride" ? (
          <div className={cx("bank")} ref={viewRef}>
            <img
              src={images.qr2.default.src}
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
              <p className={cx("name")}>{brideBank.name}</p>
              <p className={cx("bank-name")}>{brideBank.bankName}</p>
              <p className={cx("bank-number")}>{brideBank.bankNumber}</p>
            </div>
          </div>
        ) : (
          <div className={cx("bank")} ref={viewRef}>
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
              <p className={cx("name")}>{groomBank.name}</p>
              <p className={cx("bank-name")}>{groomBank.bankName}</p>
              <p className={cx("bank-number")}>{groomBank.bankNumber}</p>
            </div>
          </div>
        )}

        <CopyToClipboard
          text={nav === "bride" ? brideBank.bankNumber : groomBank.bankNumber}
          onCopy={handleCopy}
        >
          <button className={cx("btn")}>
            {!isCopied ? "Sao chép" : "Đã sao chép"}
          </button>
        </CopyToClipboard>
        <Confetti active={isCopied} config={configConfetti} />
      </div>
    </div>
  );
}

export default Gift;
