import styles from "./guestbook.module.scss";
import classNames from "classnames/bind";
import { useInView } from "framer-motion";

import { useEffect, useRef, useState } from "react";
import Gift from "../gift";
import Sad from "@/app/icons/sad";
import Angry from "@/app/icons/angry";
import Love from "@/app/icons/love";

import Confetti from "react-dom-confetti";
import { useDebounce } from "@/app/helper";
import validation from "@/app/helper/validation";
import { useRouter } from "next/navigation";
import {
  configConfetti,
  guestbookSection,
  WISH_API_LINK,
} from "@/app/configs/ui";
const cx = classNames.bind(styles);

function GuestBook({ fName }) {
  const ref = useRef();
  const viewRef = useRef();
  const isInView = useInView(ref, { once: true });
  const isInViewBox = useInView(viewRef, { once: false });
  const [isOpenGift, setIsOpenGift] = useState(false);
  const router = useRouter();

  const [name, setName] = useState("");
  const [wish, setWish] = useState("");
  const [willArrive, setWillArrive] = useState(null);

  const [active, setActive] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "info" });

  const handleChangeRadio = (type) => {
    setWillArrive(type);
  };

  const handleSendMessage = useDebounce(() => {
    const isValid = validation({ name, wish, isAttend: willArrive }, (msg) => {
      setToast({ show: true, message: msg, type: "error" });
    });

    const now = new Date();
    const last = new Date(guestbookSection.time);

    if (isValid) {
      if (now.getTime() <= last.getTime()) {
        var data = { name, wish, isAttend: willArrive };
        fetch(WISH_API_LINK, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })
          .then((response) => response.json())
          .then((data) => {
            setName("");
            setWish("");
            setWillArrive(null);
            setActive(true);
            setToast({ show: true, message: "Gửi lời chúc thành công! Cảm ơn lời chúc ngọt ngào của bạn.", type: "success" });
          })
          .catch((error) => {
            setToast({ show: true, message: "Xin lỗi! Đã xảy ra lỗi kết nối với máy chủ.", type: "error" });
          });
      } else {
        setToast({ show: true, message: "Thời gian gửi lời chúc đã kết thúc.", type: "warning" });
      }
    }
  }, 1300);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (active) {
        setActive(false);
      }
    }, 3000);

    return () => {
      clearTimeout(timeout);
    };
  }, [active]);

  const renderIcon = (type) => {
    return type !== null && type === "yes" ? (
      <Love className={cx("emoij")} />
    ) : type === "no" ? (
      <Sad className={cx("emoij")} />
    ) : type === "or" ? (
      <Angry className={cx("emoij")} />
    ) : (
      ""
    );
  };

  return (
    <div className={cx("wrapper")}>
      <div className={cx("header")} ref={viewRef}>
        <div className={cx("background")}>
          <h2 className={cx("title")}>Sổ lưu bút</h2>
        </div>
        <div className={cx("img-wrap")}>
          <div
            className={cx("img")}
            style={{
              backgroundImage: `url(${guestbookSection.image})`,
              transform: isInViewBox
                ? "translateX(0) rotate(0deg)"
                : " translateX(-200px) rotate(-180deg)",
              opacity: isInViewBox ? 1 : 0,
              transition: "all 1s cubic-bezier(0.17, 0.55, 0.55, 1)",
            }}
          />
          <div className={cx("frame")} />
        </div>
      </div>
      <div className={cx("container")}>
        <input
          type="text"
          className={cx("iname")}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Tên hoặc nickname của bạn"
        />

        <textarea
          className={cx("iwish")}
          placeholder="Viết lời chúc ở đây ..."
          value={wish}
          onChange={(e) => setWish(e.target.value)}
        />
        <div className={cx("radio-box")}>
          <input
            className={cx("radio")}
            type="radio"
            id="yes"
            name="will_arrive"
            onChange={(e) => handleChangeRadio("yes")}
            value="Sẽ đến dự tiệc"
          />
          <label htmlFor="yes">Sẽ đến dự tiệc</label>
          <input
            className={cx("radio")}
            type="radio"
            id="no"
            name="will_arrive"
            value="Không thể đến dự"
            onChange={(e) => handleChangeRadio("no")}
          />
          <label htmlFor="no">Không thể đến dự</label>
          <input
            className={cx("radio")}
            type="radio"
            name="will_arrive"
            id="or"
            value="Không biết"
            onChange={(e) => handleChangeRadio("or")}
          />
          <label htmlFor="or">Không biết</label>
        </div>
        <p className={cx("help-text")}>
          Nếu không thể gửi lời nhắn bằng trình duyệt trong{" "}
          <strong>Messeger</strong> , hãy thử mở trình duyệt bên ngoài (
          <strong>Chome, Safia,...</strong>){" "}
        </p>

        <button
          ref={ref}
          className={cx("btn")}
          style={{
            transform: isInView ? "translateY(0)" : "translateY(80px)",
            opacity: isInView ? 1 : 0,
            transition: "all 1s cubic-bezier(0.17, 0.55, 0.55, 1) ",
          }}
          onClick={handleSendMessage}
        >
          {renderIcon(willArrive)}
          Gửi lời nhắn
          {renderIcon(willArrive)}
        </button>
        {/* <button
          className={cx("btn")}
          style={{
            transform: isInView ? "translateY(0)" : "translateY(80px)",
            opacity: isInView ? 1 : 0,
            transition: "all 1s cubic-bezier(0.17, 0.55, 0.55, 1) 0.3s",
          }}
          onClick={() => setIsOpenGift(true)}
        >
          Mừng cưới
        </button> */}
        <button
          className={cx("btn")}
          style={{
            transform: isInView ? "translateY(0)" : "translateY(80px)",
            opacity: isInView ? 1 : 0,
            transition: "all 1s cubic-bezier(0.17, 0.55, 0.55, 1) 0.3s",
          }}
          onClick={() => {
            router.push(`/wish?name=${fName}`);
          }}
        >
          Xem lời chúc
        </button>
      </div>
      <Confetti active={active} config={configConfetti} />

      <Gift onClose={() => setIsOpenGift(false)} />

      {toast.show && (
        <div className={cx("toast-modal-overlay")} onClick={() => setToast(prev => ({ ...prev, show: false }))}>
          <div className={cx("toast-modal-card")} onClick={e => e.stopPropagation()}>
            <div className={cx("toast-modal-header", toast.type)}>
              <span className={cx("toast-modal-icon")}>
                {toast.type === "success" ? "🎉" : toast.type === "error" ? "❌" : "⚠️"}
              </span>
            </div>
            <div className={cx("toast-modal-body")}>
              <p>{toast.message}</p>
            </div>
            <button className={cx("toast-modal-btn")} onClick={() => setToast(prev => ({ ...prev, show: false }))}>
              Đồng ý
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default GuestBook;
