import { profile } from "@/app/configs/ui";
import styles from "./profile.module.scss";
import classNames from "classnames/bind";
import Chacracter from "./character";

const cx = classNames.bind(styles);

function Profile() {
  return (
    <div className={cx("wrapper")}>
      <h2 className={cx("title")}>PROFILE</h2>
      <p className={cx("des")}>
        Hôn nhân không phải là một điểm đến mà là một cuộc hành trình nơi mà hai
        người cùng xây dựng và phát triển
      </p>

      <div className={cx("profiles")}>
        {profile.map((pro, index) => {
          return <Chacracter data={pro} key={pro.title} />;
        })}
      </div>
    </div>
  );
}

export default Profile;
