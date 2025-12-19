"use client";
import classNames from "classnames/bind";
import styles from "./invitation.module.scss";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useDebounce } from "@/app/helper";
import { useSearchParams } from "next/navigation";
import Confetti from "react-dom-confetti";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { configConfetti } from "@/app/configs/ui";
const cx = classNames.bind(styles);

function Invitation() {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [path, setPath] = useState("");
  const searchParams = useSearchParams();

  useEffect(() => {
    setPath(`${window.location.origin}/?name=`);
  }, []);

  useEffect(() => {
    // Kiểm tra xem searchParams có hợp lệ không
    if (searchParams.size > 0) {
      window.location.href =
        window.location.origin + "/" + window.location.pathname;
    }
  }, [searchParams]);

  const handleCopy = useDebounce(() => {
    if (name.trim() === "") {
      setError("Vui lòng nhập tên người mà bạn muốn mời ");
    } else {
      setName("");
      setIsCopied(true);
    }
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
      <div className={cx("container")}>
        <h2 className={cx("title")}>
          BÁO HỈ | Nhập tên người bạn muốn gửi thiệp{" "}
        </h2>
        <p className={cx("description")}>
          Nhập tên người bạn muốn mời - nhấn SAO CHÉP - Vào tin nhắn của của
          người bạn muốn gửi - giữ nhấn DÁN (PASTE) - GỬI
        </p>
        <input
          className={cx("input")}
          value={name}
          onChange={(e) => {
            setError("");
            setName(e.target.value);
          }}
        />
        {error && <p className={cx("err")}>{error}</p>}
        <CopyToClipboard text={encodeURI(path + name)} onCopy={handleCopy}>
          <motion.button
            className={cx("btn")}
            onClick={handleCopy}
            whilehover={{
              scale: 1.1,
            }}
            whiletap={{
              scale: 0.9,
            }}
          >
            {isCopied ? "Đã sao chép" : "Sao Chép"}
          </motion.button>
        </CopyToClipboard>
      </div>
      <Confetti active={isCopied} config={configConfetti} />
    </div>
  );
}

export default Invitation;
