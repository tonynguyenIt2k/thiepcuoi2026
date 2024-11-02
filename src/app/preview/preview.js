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
import Image from "next/image";
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
          <SwiperSlide>
            <div className={cx("img-wrapper")}>
              <img className={cx("img")} alt={"image"} src={imgs[0]?.img} />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className={cx("img-wrapper")}>
              <img className={cx("img")} alt={"image"} src={imgs[1]?.img} />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className={cx("img-wrapper")}>
              <img className={cx("img")} alt={"image"} src={imgs[2]?.img} />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className={cx("img-wrapper")}>
              <img className={cx("img")} alt={"image"} src={imgs[3]?.img} />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className={cx("img-wrapper")}>
              <img className={cx("img")} alt={"image"} src={imgs[4]?.img} />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className={cx("img-wrapper")}>
              <img className={cx("img")} alt={"image"} src={imgs[5]?.img} />
            </div>
          </SwiperSlide>{" "}
          <SwiperSlide>
            <div className={cx("img-wrapper")}>
              <img className={cx("img")} alt={"image"} src={imgs[6]?.img} />
            </div>
          </SwiperSlide>{" "}
          <SwiperSlide>
            <div className={cx("img-wrapper")}>
              <img className={cx("img")} alt={"image"} src={imgs[7]?.img} />
            </div>
          </SwiperSlide>{" "}
          <SwiperSlide>
            <div className={cx("img-wrapper")}>
              <img className={cx("img")} alt={"image"} src={imgs[8]?.img} />
            </div>
          </SwiperSlide>{" "}
          <SwiperSlide>
            <div className={cx("img-wrapper")}>
              <img className={cx("img")} alt={"image"} src={imgs[9]?.img} />
            </div>
          </SwiperSlide>{" "}
          <SwiperSlide>
            <div className={cx("img-wrapper")}>
              <img className={cx("img")} alt={"image"} src={imgs[10]?.img} />
            </div>
          </SwiperSlide>{" "}
          <SwiperSlide>
            <div className={cx("img-wrapper")}>
              <img className={cx("img")} alt={"image"} src={imgs[11]?.img} />
            </div>
          </SwiperSlide>{" "}
          <SwiperSlide>
            <div className={cx("img-wrapper")}>
              <img className={cx("img")} alt={"image"} src={imgs[12]?.img} />
            </div>
          </SwiperSlide>{" "}
          <SwiperSlide>
            <div className={cx("img-wrapper")}>
              <img className={cx("img")} alt={"image"} src={imgs[13]?.img} />
            </div>
          </SwiperSlide>{" "}
          <SwiperSlide>
            <div className={cx("img-wrapper")}>
              <img className={cx("img")} alt={"image"} src={imgs[14]?.img} />
            </div>
          </SwiperSlide>{" "}
          <SwiperSlide>
            <div className={cx("img-wrapper")}>
              <img className={cx("img")} alt={"image"} src={imgs[15]?.img} />
            </div>
          </SwiperSlide>{" "}
          <SwiperSlide>
            <div className={cx("img-wrapper")}>
              <img className={cx("img")} alt={"image"} src={imgs[16]?.img} />
            </div>
          </SwiperSlide>{" "}
          <SwiperSlide>
            <div className={cx("img-wrapper")}>
              <img className={cx("img")} alt={"image"} src={imgs[17]?.img} />
            </div>
          </SwiperSlide>{" "}
          <SwiperSlide>
            <div className={cx("img-wrapper")}>
              <img className={cx("img")} alt={"image"} src={imgs[18]?.img} />
            </div>
          </SwiperSlide>{" "}
          <SwiperSlide>
            <div className={cx("img-wrapper")}>
              <img className={cx("img")} alt={"image"} src={imgs[19]?.img} />
            </div>
          </SwiperSlide>{" "}
          <SwiperSlide>
            <div className={cx("img-wrapper")}>
              <img className={cx("img")} alt={"image"} src={imgs[20]?.img} />
            </div>
          </SwiperSlide>{" "}
          <SwiperSlide>
            <div className={cx("img-wrapper")}>
              <img className={cx("img")} alt={"image"} src={imgs[21]?.img} />
            </div>
          </SwiperSlide>{" "}
          <SwiperSlide>
            <div className={cx("img-wrapper")}>
              <img className={cx("img")} alt={"image"} src={imgs[22]?.img} />
            </div>
          </SwiperSlide>{" "}
          <SwiperSlide>
            <div className={cx("img-wrapper")}>
              <img className={cx("img")} alt={"image"} src={imgs[23]?.img} />
            </div>
          </SwiperSlide>{" "}
          <SwiperSlide>
            <div className={cx("img-wrapper")}>
              <img className={cx("img")} alt={"image"} src={imgs[24]?.img} />
            </div>
          </SwiperSlide>{" "}
          <SwiperSlide>
            <div className={cx("img-wrapper")}>
              <img className={cx("img")} alt={"image"} src={imgs[25]?.img} />
            </div>
          </SwiperSlide>{" "}
          <SwiperSlide>
            <div className={cx("img-wrapper")}>
              <img className={cx("img")} alt={"image"} src={imgs[26]?.img} />
            </div>
          </SwiperSlide>{" "}
          <SwiperSlide>
            <div className={cx("img-wrapper")}>
              <img className={cx("img")} alt={"image"} src={imgs[27]?.img} />
            </div>
          </SwiperSlide>{" "}
          <SwiperSlide>
            <div className={cx("img-wrapper")}>
              <img className={cx("img")} alt={"image"} src={imgs[28]?.img} />
            </div>
          </SwiperSlide>{" "}
          <SwiperSlide>
            <div className={cx("img-wrapper")}>
              <img className={cx("img")} alt={"image"} src={imgs[29]?.img} />
            </div>
          </SwiperSlide>{" "}
          <SwiperSlide>
            <div className={cx("img-wrapper")}>
              <img className={cx("img")} alt={"image"} src={imgs[30]?.img} />
            </div>
          </SwiperSlide>{" "}
          <SwiperSlide>
            <div className={cx("img-wrapper")}>
              <img className={cx("img")} alt={"image"} src={imgs[31]?.img} />
            </div>
          </SwiperSlide>{" "}
          <SwiperSlide>
            <div className={cx("img-wrapper")}>
              <img className={cx("img")} alt={"image"} src={imgs[32]?.img} />
            </div>
          </SwiperSlide>{" "}
          <SwiperSlide>
            <div className={cx("img-wrapper")}>
              <img className={cx("img")} alt={"image"} src={imgs[33]?.img} />
            </div>
          </SwiperSlide>{" "}
        </Swiper>
        <div className={cx("icon-box", "next-icon")} onClick={handleNext}>
          <GoChevronRight className={cx("icon")} />
        </div>
      </div>
    </div>
  );
}

export default Preview;
