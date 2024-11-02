import classNames from "classnames/bind";
import styles from "./game.module.scss";
import Jumping from "../jumping";
import { useState } from "react";

const cx = classNames.bind(styles);

function Game() {
  const [dif, setDif] = useState("20");
  return (
    <div className={cx("wrapper")}>
      <div className={cx("text-box")}>
        <h2 className={cx("title")}>GAME</h2>
        <p className={cx("des")}>
          Người chơi sẽ hóa thân làm chú rể vượt qua các vật cản (thuốc lá, rượu
          chè, cờ bạc, bạo lực gia đình) để đến với cô dâu, truyền tải thông
          điệp về cam kết và trách nhiệm trong xây dựng hạnh phúc gia đình. Hành
          trình này giúp chú rể đến gần cô dâu mà còn hoàn thiện bản thân, chuẩn
          bị tốt hơn cho cuộc sống hôn nhân.
        </p>
        <form className={cx("difficulty")}>
          <label className={cx("label")} htmlFor="difficulty">
            Độ khó :{" "}
          </label>
          <select
            selected="selected"
            className={cx("selector")}
            name="difficulty"
            id="difficulty"
            value={dif}
            onChange={(e) => setDif(e.target.value)}
          >
            <option className={cx("dif-option")} value="10">
              20
            </option>
            <option className={cx("dif-option")} value="50">
              50
            </option>
            <option className={cx("dif-option")} value="100">
              100
            </option>
          </select>
        </form>
      </div>

      <Jumping className={cx("game")} dif={+dif} />
    </div>
  );
}

export default Game;
