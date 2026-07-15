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
import { FaQrcode, FaLink, FaDownload, FaEye, FaUsers } from "react-icons/fa";

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
    if (searchParams.size > 0) {
      window.location.href =
        window.location.origin + "/" + window.location.pathname;
    }
  }, [searchParams]);

  const handleCopy = useDebounce(() => {
    if (name.trim() === "") {
      setError("Vui lòng nhập tên người mà bạn muốn mời");
    } else {
      setIsCopied(true);
    }
  }, 300);

  useEffect(() => {
    let timeout;
    if (isCopied) {
      timeout = setTimeout(() => {
        setIsCopied(false);
      }, 1500);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [isCopied]);

  const getGuestLink = (guestName) => {
    return path + encodeURIComponent(guestName.trim());
  };

  const getQRCodeUrl = (link) => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(link)}`;
  };

  const handleDownloadQR = async () => {
    if (!name.trim()) return;
    const qrUrl = getQRCodeUrl(getGuestLink(name));
    try {
      const res = await fetch(qrUrl);
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      const cleanName = name.trim().replace(/[^a-zA-Z0-9_\sÀ-ỹ]/g, "").replace(/\s+/g, "_");
      a.download = `QR_ThiepCuoi_${cleanName || "Khach"}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(objectUrl);
    } catch (err) {
      console.error("Lỗi khi tải ảnh QR:", err);
    }
  };

  return (
    <div className={cx("wrapper")}>
      {/* Background decorations */}
      <div className={cx("bg-circle", "circle-1")}></div>
      <div className={cx("bg-circle", "circle-2")}></div>

      <div className={cx("container")}>
        <motion.div 
          className={cx("card")}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className={cx("header")}>
            <div className={cx("logo-icon")}>
              <FaQrcode />
            </div>
            <h2 className={cx("title")}>Tạo Link & QR Mời Khách</h2>
            <p className={cx("subtitle")}>
              Điền tên khách mời để tự động tạo mã QR và liên kết thiệp cưới cá nhân hóa.
            </p>
          </div>

          <div className={cx("input-wrapper")}>
            <div className={cx("input-icon")}>
              <FaUsers />
            </div>
            <input
              className={cx("input")}
              placeholder="Nhập tên khách mời..."
              value={name}
              onChange={(e) => {
                setError("");
                setName(e.target.value);
              }}
            />
          </div>
          {error && <p className={cx("err")}>{error}</p>}

          {name.trim() && (
            <motion.div 
              className={cx("qr-section")}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {/* QR frame */}
              <div className={cx("qr-frame-wrapper")}>
                <div className={cx("corner", "top-left")}></div>
                <div className={cx("corner", "top-right")}></div>
                <div className={cx("corner", "bottom-left")}></div>
                <div className={cx("corner", "bottom-right")}></div>
                <img
                  className={cx("qr-img")}
                  src={getQRCodeUrl(getGuestLink(name))}
                  alt="Mã QR Thiệp Mời"
                />
              </div>

              <div className={cx("link-preview")}>
                <span className={cx("link-label")}>Đường dẫn riêng:</span>
                <div className={cx("link-box")}>
                  <input
                    type="text"
                    readOnly
                    value={getGuestLink(name)}
                    onClick={() => {
                      navigator.clipboard.writeText(getGuestLink(name));
                      handleCopy();
                    }}
                  />
                </div>
              </div>

              <div className={cx("actions")}>
                <CopyToClipboard text={getGuestLink(name)} onCopy={handleCopy}>
                  <button className={cx("btn", "btn-copy")}>
                    <FaLink /> {isCopied ? "Đã sao chép" : "Copy Link"}
                  </button>
                </CopyToClipboard>

                <button className={cx("btn", "btn-download")} onClick={handleDownloadQR}>
                  <FaDownload /> Tải ảnh QR
                </button>

                <a 
                  className={cx("btn", "btn-preview")}
                  href={getGuestLink(name)}
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaEye /> Xem thử thiệp
                </a>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
      <Confetti active={isCopied} config={configConfetti} />
    </div>
  );
}

export default Invitation;
