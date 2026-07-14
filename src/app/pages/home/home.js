"use client";
import classNames from "classnames/bind";
import styles from "./home.module.scss";
import Invitation from "@/app/component/invitation";
import { useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import Profile from "@/app/component/profile";
import GuestBook from "@/app/component/guestbook";
import Album from "@/app/component/album";
import Intro from "@/app/component/intro/intro";
import { animateScroll as scroll } from "react-scroll";
import PaperText from "@/app/component/paperText/paperText";
import Footer from "@/app/component/footer";
import Final from "@/app/component/final";
import Game from "@/app/component/game";
import { MultiContext } from "@/app/context";
import Disk from "@/app/component/disk";
import Timer from "@/app/component/timer";

const cx = classNames.bind(styles);
export default function Home() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name") || "You";

  const [isOpen, setIsOpen] = useState(false);

  const { dispatch } = useContext(MultiContext);

  useEffect(() => {
    if (searchParams.get("fbclid")) {
      window.location.href = window.location.origin + "/" + "?name=" + name;
    }
    // Cập nhật title động dưới client
    document.title = `Báo Hỷ Hùng - Thúy | Kính Mời ${name}`;
  }, [searchParams, name]);

  const handleOpenInvitation = () => {
    setIsOpen(true);
    dispatch({ type: "TURN_ON" });
    if (isOpen === false) {
      setIsOpen(true);
    }
  };

  useEffect(() => {
    if (isOpen == true) {
      let pageHeight = window.innerHeight;
      scroll.scrollTo(pageHeight);
    }
  }, [isOpen]);
  return (
    <div className={cx("wrapper")}>
      <Disk />
      <Intro handleOpen={handleOpenInvitation} name={name} />
      {isOpen && (
        <>
          <Profile />
          <PaperText>
            “Tình cảm ấy, chẳng cần cứ phải hét to lên cho cả thế giới biết, chỉ
            cần thủ thỉ cho một người là cả thế giới của mình nghe là đủ rồi.
            Điều quan trọng nhất là đến cuối đường vẫn còn ở bên nhau, đi cạnh
            nhau, nắm tay nhau, rung động vì nhau. Cứ thế thôi là đủ rồi!”
          </PaperText>
          <Invitation />
          <Album name={name}></Album>
          <GuestBook fName={name} />
          <Game />
          <Timer />
          <Final />
          <Footer />
        </>
      )}
    </div>
  );
}
