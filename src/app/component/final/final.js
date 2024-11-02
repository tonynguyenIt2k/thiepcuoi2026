import classNames from "classnames/bind";
import styles from "./final.module.scss";
import PaperText from "../paperText/paperText";
import { finalImages } from "../../configs/ui";

const cx = classNames.bind(styles);

function Final() {
  return (
    <div className={cx("wrapper")}>
      <h2 className={cx("title")}>Thank you</h2>

      <div className={cx("noise")}>
        <div className={cx("imgs")}>
          {finalImages.map((src) => {
            return (
              <div className={cx("img-wrap")} key={src}>
                <img className={cx("img")} src={src} />
              </div>
            );
          })}
        </div>
      </div>
      <PaperText className={cx("des")}>
        Chúng tôi vô cùng biết ơn tình cảm và sự ủng hộ của bạn trong suốt thời
        gian qua. Để kỷ niệm ngày hai chúng tôi nên duyên vợ chồng xin kính mời
        bạn cùng gia đình đến dự lễ cưới của chúng tôi. Sự hiện diện của bạn là
        niềm vinh dự lớn cho chúng tôi trong ngày hạnh phúc này.
      </PaperText>
    </div>
  );
}

export default Final;
