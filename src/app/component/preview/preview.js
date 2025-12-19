import classNames from "classnames/bind";
import styles from "./preview.module.scss";
import { CgClose } from "react-icons/cg";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Controller,
} from "swiper/modules";
import "swiper/css";
import "swiper/css/bundle";

import { useEffect, useState } from "react";
const cx = classNames.bind(styles);

function Preview({ data, onClose, index }) {
  const [imgs, setImgs] = useState([]);
  const [swipper, setSwipper] = useState(null);
  const [activeIndex, setActiveIndex] = useState(swipper?.activeIndex);
  const platten = () => {
    let dataPlatten = [];
    data.forEach((d) => {
      d.imgs.forEach((dd) => {
        dataPlatten.push(dd);
      });
    });

    return dataPlatten;
  };

  useEffect(() => {
    setImgs(platten());
  }, []);

  const handleNext = () => {
    swipper.slideNext();
  };

  const handlePrev = () => {
    swipper.slidePrev();
  };

  return (
    <div className={cx("wrapper")}>
      <div className={cx("nav")}>
        <span className={cx("paging")}>{`${activeIndex + 1 || 1}/${
          imgs.length
        }`}</span>

        <CgClose className={cx("icon")} onClick={onClose} />
      </div>

      <div className={cx("container")}>
        <div className={cx("icon-box", "pre-icon")} onClick={handlePrev}>
          <GoChevronLeft className={cx("icon")} />
        </div>
        <Swiper
          modules={[Navigation, Pagination, Scrollbar, A11y, Controller]}
          spaceBetween={100}
          slidesPerView={1}
          initialSlide={index - 1}
          onSwiper={setSwipper}
          onSlideChange={(swiper) => {
            setActiveIndex(swiper.activeIndex);
          }}
          controller={{ control: swipper }}
        >
          {imgs.map((img) => {
            return (
              <SwiperSlide key={img.img}>
                <div className={cx("img-wrapper")}>
                  <img className={cx("img")} alt={"image"} src={img.img} />
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
        <div className={cx("icon-box", "next-icon")} onClick={handleNext}>
          <GoChevronRight className={cx("icon")} />
        </div>
      </div>
    </div>
  );
}

export default Preview;
