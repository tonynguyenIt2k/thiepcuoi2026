"use client";
import styles from "./disk.module.scss";
import classNames from "classnames/bind";
import { useEffect, useRef, useContext } from "react";
import sound from "@/app/static/sound.mp3";
import { MultiContext } from "@/app/context";
import { musicUrl } from "@/app/configs/ui";

const cx = classNames.bind(styles);

function Disk() {
  const ref = useRef(null);

  const { state, dispatch } = useContext(MultiContext);

  const { isOpenMusic } = state;

  const handleOpenAudio = () => {
    if (isOpenMusic === false) {
      dispatch({ type: "TURN_ON" });
      ref.current.play();
    } else {
      dispatch({ type: "TURN_OFF" });
      ref.current.pause();
    }
  };

  useEffect(() => {
    if (ref.current && isOpenMusic && ref.current.paused) {
      ref.current.play();
    }
  }, [isOpenMusic]);
  return (
    <div
      className={cx("music", isOpenMusic && "rotate")}
      onClick={handleOpenAudio}
    >
      <audio src={musicUrl || sound} ref={ref} />
    </div>
  );
}

export default Disk;

