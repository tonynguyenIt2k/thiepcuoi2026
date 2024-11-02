"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./wish.module.scss";
import Link from "next/link";
// import { api } from "../wedding";
const cx = classNames.bind(styles);

function Wish({}) {
  const [wishes, setWishes] = useState([]);
  const searchParams = useSearchParams();

  const name = searchParams.get("name") || "You";

  const router = useRouter();
  useEffect(() => {
    function compareByDate(a, b) {
      return b.createdAt - a.createdAt;
    }

    fetch("https://67244368493fac3cf24dafe9.mockapi.io/api/v1/wishes")
      .then((response) => response.json())
      .then((data) => {
        data = data.sort(compareByDate);
        setWishes(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  return (
    <div className={cx("wrapper")}>
      <h2 className={cx("title")}>ALL WISHES FOR YOUU</h2>
      <div className={cx("container")}>
        {wishes.length > 0 ? (
          wishes.map((w, index) => {
            return (
              <div className={cx("wish")} key={index}>
                <span className={cx("name")}>{w?.name}</span>
                <p className={cx("content")}>{w?.wish}</p>
                <span className={cx("isAttend")}>
                  Tham dự : {w?.isAttend ? "Có" : "Không"}
                </span>
              </div>
            );
          })
        ) : (
          <p className={cx("nodata")}>
            Chúng tôi rất vui nếu nhận được lời chúc từ các bạn
          </p>
        )}
      </div>

      <Link href={`/?name=${name}`} className={cx("link")}>
        Quay lại trang chính
      </Link>
    </div>
  );
}

export default Wish;
