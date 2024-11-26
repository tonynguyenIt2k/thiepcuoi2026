import classNames from "classnames/bind";
import styles from "./intro.module.scss";
import images from "@/app/images";
import { motion } from "framer-motion";
import { useRef } from "react";
import { weddingInfo } from "@/app/configs/ui";
const cx = classNames.bind(styles);

function Intro({ handleOpen, name = "You" }) {
  const ref = useRef(null);

  console.log(name);
  return (
    <div className={cx("wrapper")} ref={ref}>
      <div className={cx("block-wrapper")}>
        <div className={cx("block")}>
          <div className={cx("left")}>
            <p className={cx("header-text")}>SAVE THE DATE</p>

            <div className={cx("img-box")}>
              <img
                className={cx("img")}
                src="https://res.cloudinary.com/do6sozxbo/image/upload/f_auto,q_auto/v1/wedding5/e3"
              />
            </div>
          </div>
          <div className={cx("right")}>
            <div className={cx("text-box")}>
              <p className={cx("date")}>{weddingInfo[0].time.full}</p>
              <div className={cx("name-box")}>
                <h3 className={cx("name")} style={{ marginTop: "-40px" }}>
                  T
                </h3>
                <span className={cx("and")}></span>
                <h3 className={cx("name")} style={{ marginBottom: "-40px" }}>
                  H
                </h3>
              </div>

              <div className={cx("dear-box")}>
                <p className={cx("dear")}>Thân mời : </p>
                <span className={cx("dear-name")}>{name}</span>
              </div>
            </div>
            {/* 
            <img
              src={images.ring.default.src}
              alt="ring"
              className={cx("ring")}
            /> */}

            {/* <Arrow /> */}

            <motion.button
              className={cx("btn")}
              whilehover={{ scale: 1.1 }}
              whiletap={{ scale: 0.9 }}
              onClick={handleOpen}
            >
              <span className={cx("heart-icon")}>
                <img className={cx("icon")} src={images.invite.default.src} />
              </span>
              Mở thiệp
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Intro;
