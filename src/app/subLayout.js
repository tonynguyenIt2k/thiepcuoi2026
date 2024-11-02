"use client";
import "./globals.css";
import { Suspense, useEffect, useRef, useContext } from "react";
import Loading from "./component/loading/loading";
import { ImMusic } from "react-icons/im";
import sound from "@/app/static/sound.mp3";
import { MultiContext } from "./context";

function Sublayout({ children }) {
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
    <Suspense fallback={<Loading />}>
      {" "}
      <div
        className={`music ${isOpenMusic && "rotate"}`}
        onClick={handleOpenAudio}
      >
        <audio src={sound} ref={ref} />
      </div>
      {children}
    </Suspense>
  );
}

export default Sublayout;
