"use client";
import { useEffect, useRef, useState } from "react";
import classNames from "classnames/bind";
import styles from "./jumping.module.scss";

const items = ["alcohol", "cigarette", "punch", "at"];
const cx = classNames.bind(styles);

const random = () => {
  return Math.floor(Math.random() * 4);
};
function Jumping({ className, dif }) {
  const groomRef = useRef();
  const cactusRef = useRef();
  const brideRef = useRef();
  const [item, setItem] = useState(items[0]);
  const [isJumping, setIsJumping] = useState(false);
  const [score, setScore] = useState(0);
  const [isStart, setIsStart] = useState(false);
  const [isDie, setIsDie] = useState(false);
  const [isWin, setIsWin] = useState(false);
  const jump = (e) => {
    if (!!groomRef.current && groomRef.current.classList.length == 1) {
      setIsJumping(true);
      setTimeout(function () {
        setIsJumping(false);
      }, 300);
    }
  };

  useEffect(() => {
    let isAlive;
    if (isStart && !isWin) {
      isAlive = setInterval(function () {
        // get current dino Y position
        const groomTop = parseInt(
          getComputedStyle(groomRef.current).getPropertyValue("top")
        );

        // get current cactus X position
        let cactusLeft = parseInt(
          getComputedStyle(cactusRef.current).getPropertyValue("left")
        );

        // detect collision
        if (cactusLeft < 60 && cactusLeft > 0 && groomTop >= 295) {
          // collision
          // alert("Game Over! Your Score : " + score);
          setIsStart(false);
          setIsDie(true);
        } else if (cactusLeft <= -30) {
          if (score >= dif) {
            setIsWin(true);
            setScore(dif);
          } else {
            setItem(items[random()]);
          }
          setScore((pre) => pre + 1);
        }
      }, 10);
    } else if (isStart && isWin) {
      isAlive = setInterval(() => {
        const groomLeft = parseInt(
          getComputedStyle(groomRef.current).getPropertyValue("left")
        );

        let brideLeft = parseInt(
          getComputedStyle(brideRef.current).getPropertyValue("left")
        );

        if (groomLeft >= 0 && brideLeft <= 30) {
          setIsStart(false);
        }
      }, 10);
    }

    return () => clearInterval(isAlive);
  });

  useEffect(() => {
    document.addEventListener("keydown", jump);
    return () => document.removeEventListener("keydown", jump);
  }, []);

  return (
    <div className={cx("game", className)} onClick={jump}>
      {isStart ? (
        <div className={cx("gaming-ui")}>
          <span className={cx("score")}> Score : {score}</span>
          <div
            className={cx("groom", isJumping && "jump")}
            ref={groomRef}
          ></div>
          {!isWin && <div className={cx("obs", item)} ref={cactusRef}></div>}
          {isWin && <div className={cx("bride")} ref={brideRef}></div>}
        </div>
      ) : (
        <div
          className={cx("finshish-ui", isDie && "die-ui", isWin && "win-ui")}
        >
          <p className={cx("title")}>
            {isDie ? "Game over" : isWin ? "You Win" : "Đi tìm cô dâu"}
          </p>

          {/* {(isDie || isWin) && (
            <p className={cx("score")}>Điểm của bạn: {score}</p>
          )} */}
          <p
            className={cx("start-button")}
            onClick={() => {
              setIsDie(false);
              setIsStart(true);
              setScore(0);
              setIsWin(false);
            }}
          >
            Start
          </p>
        </div>
      )}
    </div>
  );
}

export default Jumping;
