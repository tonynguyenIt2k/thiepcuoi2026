import { giftSection } from "@/app/configs/ui";
import styles from "./gift.module.scss";
import classNames from "classnames/bind";
import { useInView } from "framer-motion";
import { useEffect, useRef } from "react";
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
        <img className={cx("img")} src={giftSection.image} />

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
              src={giftSection.brideBank.qr}
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
              <p className={cx("name")}>{giftSection.brideBank.name}</p>
              <p className={cx("bank-name")}>
                {giftSection.brideBank.bankName}
              </p>
              <p className={cx("bank-number")}>
                {giftSection.brideBank.bankNumber}
              </p>
            </div>
          </div>
        ) : (
          <div className={cx("bank")} ref={viewRef}>
            <img
              src={giftSection.groomBank.qr}
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
              <p className={cx("name")}>{giftSection.groomBank.name}</p>
              <p className={cx("bank-name")}>
                {giftSection.groomBank.bankName}
              </p>
              <p className={cx("bank-number")}>
                {giftSection.groomBank.bankNumber}
              </p>
            </div>
          </div>
        )}

        <CopyToClipboard
          text={
            nav === "bride"
              ? giftSection.brideBank.bankNumber
              : giftSection.groomBank.bankNumber
          }
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
