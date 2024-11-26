"use client";
import images from "@/app/images";
import styles from "./album.module.scss";
import classNames from "classnames/bind";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { album } from "@/app/configs/ui";
import Link from "next/link";

const cx = classNames.bind(styles);

function Album({ name }) {
  const [nav1, setNav1] = useState(null);
  const [nav2, setNav2] = useState(null);
  let sliderRef1 = useRef(null);
  let sliderRef2 = useRef(null);
  const viewRef = useRef();
  const isInView = useInView(viewRef, { once: true });

  useEffect(() => {
    setNav1(sliderRef1);
    setNav2(sliderRef2);
  }, []);

  return (
    <div className={cx("wrapper")}>
      <div className={cx("header")}>
        <div className={cx("side-img-wrap")} ref={viewRef}>
          <img
            src={album[2]}
            className={cx("side-img")}
            style={{
              transform: isInView
                ? "translateX(0) rotate(0deg)"
                : "translateX(-200px) rotate(-100deg)",
              opacity: isInView ? 1 : 0,
              transition: "all 1s cubic-bezier(0.17, 0.55, 0.55, 1)",
            }}
          />
        </div>
        <div className={cx("content")}>
          <div className={cx("title")}>
            <span className={cx("text")}>Share</span>
            <span className={cx("text")}>the</span>
            <span className={cx("text")}>Love</span>
          </div>
          <div className={cx("main-img-wrap")}>
            <img
              className={cx("main-img")}
              src={album[5]}
              style={{
                transform: isInView
                  ? "translateX(0) rotate(0deg)"
                  : " translate(200px, -100px) rotate(100deg)",
                opacity: isInView ? 1 : 0,
                transition: "all 1s cubic-bezier(0.17, 0.55, 0.55, 1)",
              }}
            />
          </div>
        </div>
      </div>
      <div className={cx("container")}>
        <Slider
          className={cx("slide-monitor")}
          asNavFor={nav2}
          autoplay
          speed={2000}
          autoplaySpeed={3000}
          pauseOnHover
          arrows={false}
          pauseOnFocus
          adaptiveHeight
          ref={(slider) => (sliderRef1 = slider)}
        >
          {album.map((src) => {
            return (
              <div className={cx("monitor")} key={src}>
                <img className={cx("monitor-img")} src={src} />
              </div>
            );
          })}
        </Slider>
        <Slider
          className={cx("slide-selector")}
          asNavFor={nav1}
          ref={(slider) => (sliderRef2 = slider)}
          arrows={false}
          slidesToShow={5}
          slidesToScroll={5}
          speed={2000}
          autoplaySpeed={3000}
          pauseOnHover
          pauseOnFocus
          swipeToSlide={true}
          focusOnSelect={true}
          responsive={[
            {
              breakpoint: 1024,
              settings: {
                slidesToShow: 4,
                slidesToScroll: 4,
              },
            },
            {
              breakpoint: 600,
              settings: {
                slidesToShow: 3,
                slidesToScroll: 3,
              },
            },
            {
              breakpoint: 480,
              settings: {
                slidesToShow: 2,
                slidesToScroll: 2,
              },
            },
          ]}
        >
          {album.map((src, index) => {
            return (
              <div className={cx("selector")} key={src}>
                <img className={cx("selector-img")} src={src} />
              </div>
            );
          })}
        </Slider>
      </div>

      <Link className={cx("btn")} href={`/albums?name=${name}`}>
        Xem hết album
      </Link>
    </div>
  );
}

export default Album;
