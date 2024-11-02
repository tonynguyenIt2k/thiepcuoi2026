"use client";
import classNames from "classnames/bind";
import styles from "./page.module.scss";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { copyTextToClipboard, useDebounce } from "@/app/helper";
import { useSearchParams } from "next/navigation";

const cx = classNames.bind(styles);

function Page() {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const searchParams = useSearchParams();

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
      const path = `${window.location.origin}/?name=${encodeURI(name)}`;
      copyTextToClipboard(path);
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
        <h2 className={cx("title")}>Nhập tên người bạn muốn gửi thiệp</h2>
        <input
          className={cx("input")}
          value={name}
          onChange={(e) => {
            setError("");
            setName(e.target.value);
          }}
        />
        {error && <p className={cx("err")}>{error}</p>}
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
      </div>
    </div>
  );
}

export default Page;
