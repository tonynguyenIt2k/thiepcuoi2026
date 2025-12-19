"use client";
import classNames from "classnames/bind";
import styles from "./album.module.scss";
import { albumA, albumB, albumC, albums, albumPage } from "@/app/configs/ui";
import { useRef, useState } from "react";
import Preview from "@/app/component/preview";
import { useSearchParams } from "next/navigation";
import { useInView } from "framer-motion";
import Image from "../../component/image";
import { useRouter } from "next/navigation";
const cx = classNames.bind(styles);

function Album() {
  const searchParam = useSearchParams();
  const viewRef = useRef();
  const isInView = useInView(viewRef, { once: false });
  const name = searchParam.get("name") || "You";
  const [isShow, setIsShow] = useState(false);
  const [index, setIndex] = useState(0);
  const router = useRouter();

  const handleClosePreview = () => {
    setIsShow(false);
  };

  return (
    <div className={cx("wrapper")} ref={viewRef}>
      <div className={cx("header")}>
        <div className={cx("back-img")}>
          <h2
            className={cx("title")}
            style={{
              opacity: isInView ? 1 : 0,
              top: isInView ? "24px" : "-100px",
              transition: "all 1s cubic-bezier(0.17, 0.55, 0.55, 1)",
            }}
          >
            Album chúng mình
          </h2>
          <img className={cx("hbimg")} src={albumPage.topImage} />
        </div>
        <div
          className={cx("front-img")}
          style={{
            opacity: isInView ? 1 : 0,
            top: isInView ? "50%" : "100%",
            transition: "all 1s cubic-bezier(0.17, 0.55, 0.55, 1)",
          }}
        >
          <img className={cx("hfimg")} src={albumPage.mainImage} />
        </div>
      </div>
      <div className={cx("container")}>
        <div className={cx("row")}>
          {albumA.map((imgs, index) => {
            return (
              <div className={cx("column")} key={index}>
                {imgs.imgs.map((img, index) => {
                  return (
                    <div
                      key={index}
                      className={cx("img-block")}
                      onClick={() => {
                        setIsShow(true);
                        setIndex(img.id);
                      }}
                    >
                      <Image key={index} src={img.img} />
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        <div className={cx("row")}>
          {albumB.map((imgs, index) => {
            return (
              <div className={cx("column")} key={index}>
                {imgs.imgs.map((img, index) => {
                  return (
                    <div
                      key={index}
                      className={cx("img-block")}
                      onClick={() => {
                        setIsShow(true);
                        setIndex(img.id);
                      }}
                    >
                      <Image key={index} src={img.img} />
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        <div className={cx("row")}>
          {albumC.map((imgs, index) => {
            return (
              <div className={cx("column")} key={index}>
                {imgs.imgs.map((img, index) => {
                  return (
                    <div
                      key={index}
                      className={cx("img-block")}
                      onClick={() => {
                        setIsShow(true);
                        setIndex(img.id);
                      }}
                    >
                      <Image key={index} src={img.img} />
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {isShow && (
          <Preview data={albums} onClose={handleClosePreview} index={index} />
        )}

        <div className={cx("btn-box")}>
          <button
            className={cx("btn")}
            onClick={() => {
              router.push(`/?name=${name}`);
            }}
          >
            Quay lại trang chính
          </button>
        </div>
      </div>

      <div className={cx("footer")}>
        <h2 className={cx("text")}>Thank you</h2>
        <div className={cx("img-wrap")}>
          <img className={cx("img")} src={albumPage.bottomImage} />
        </div>
      </div>
    </div>
  );
}

export default Album;
