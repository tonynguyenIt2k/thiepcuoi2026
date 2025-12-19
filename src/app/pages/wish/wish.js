"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./wish.module.scss";
import Link from "next/link";
import Love from "@/app/icons/love";
import Sad from "@/app/icons/sad";
import Angry from "@/app/icons/angry";
import wishArray from "@/api/wishes";
import { WISH_API_LINK } from "@/app/configs/ui";
const cx = classNames.bind(styles);

function Wish({}) {
  const [wishes, setWishes] = useState([]);
  const searchParams = useSearchParams();

  const name = searchParams.get("name") || "You";

  useEffect(() => {
    function compareByDate(a, b) {
      return b.createdAt - a.createdAt;
    }

    if (!WISH_API_LINK) {
      const data = wishArray.sort(compareByDate);
      setWishes(data);
    } else {
      fetch(WISH_API_LINK)
        .then((response) => response.json())
        .then((data) => {
          data = data.sort(compareByDate);
          setWishes(data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }, []);

  return (
    <div className={cx("wrapper")}>
      <h2 className={cx("title")}>ALL WISHES FOR YOUU</h2>

      <div className={cx("statistic")}>
        <div className={cx("s-wrap")}>
          <Love className={cx("icon")} />
          <span className={cx("number")}>
            {wishes.length > 0
              ? wishes.filter((w) => w.isAttend === "yes").length
              : 0}
          </span>
        </div>
        <div className={cx("s-wrap")}>
          <Sad className={cx("icon")} />
          <span className={cx("number")}>
            {" "}
            {wishes.length > 0
              ? wishes.filter((w) => w.isAttend === "no").length
              : 0}
          </span>
        </div>
        <div className={cx("s-wrap")}>
          <Angry className={cx("icon")} />
          <span className={cx("number")}>
            {" "}
            {wishes.length > 0
              ? wishes.filter((w) => w.isAttend === "or").length
              : 0}
          </span>
        </div>
      </div>
      <div className={cx("container")}>
        {wishes.length > 0 ? (
          wishes.map((w, index) => {
            return (
              <div className={cx("wish")} key={index}>
                <span className={cx("name")}>{w?.name}</span>
                <p className={cx("content")}>{w?.wish}</p>
                <span className={cx("isAttend")}>
                  Tham dự :{" "}
                  {w?.isAttend === "yes"
                    ? "Sẽ đến dự tiệc"
                    : w?.isAttend === "no"
                    ? "Không thể đến dự"
                    : "Không biết"}
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
