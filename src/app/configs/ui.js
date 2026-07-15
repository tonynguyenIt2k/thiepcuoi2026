import images from "../images";
import uiData from "./ui.json";

const WISH_API_LINK = uiData.WISH_API_LINK !== undefined ? uiData.WISH_API_LINK : "";
const musicUrl = uiData.musicUrl || "";
const invitationDomain = uiData.invitationDomain || "https://thiep-cuoi-hung-thuy.vercel.app";


const configConfetti = uiData.configConfetti || {
  angle: "188",
  spread: 360,
  startVelocity: "50",
  elementCount: "133",
  dragFriction: 0.12,
  duration: 3000,
  stagger: "0",
  width: "10px",
  height: "10px",
  perspective: "500px",
  colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"],
};

const weddingInfo = uiData.weddingInfo || [];
const daysInMonth = uiData.daysInMonth || [];
const introSection = uiData.introSection || {};
const profileSection = uiData.profileSection || {};
const invitationSection = uiData.invitationSection || {};
const albumSection = uiData.albumSection || {};
const guestbookSection = uiData.guestbookSection || {};

const giftSection = {
  image: uiData.giftSection?.image || "https://res.cloudinary.com/do6sozxbo/image/upload/v1730383598/wedding5/am3.jpg",
  brideBank: {
    name: uiData.giftSection?.brideBank?.name || "Trần Thị Thuý",
    bankName: uiData.giftSection?.brideBank?.bankName || "Vietinbank ",
    qr: uiData.giftSection?.brideBank?.qr || images.qr2.default.src,
    bankNumber: uiData.giftSection?.brideBank?.bankNumber || "107880386791",
  },
  groomBank: {
    name: uiData.giftSection?.groomBank?.name || "Lang Mạnh Hùng",
    bankName: uiData.giftSection?.groomBank?.bankName || "MB BANK",
    qr: uiData.giftSection?.groomBank?.qr || images.qr.default.src,
    bankNumber: uiData.giftSection?.groomBank?.bankNumber || "9999999996654",
  },
};

const timerSection = uiData.timerSection || {};
const finalSection = uiData.finalSection || {};
const albumPage = uiData.albumPage || {};
const albumA = uiData.albumA || [];
const albumB = uiData.albumB || [];
const albumC = uiData.albumC || [];
const albums = [...albumA, ...albumB, ...albumC];
const creator = uiData.creator || {
  name: "Danh Tuấn",
  link: "https://www.facebook.com/profile.php?id=100015195702096",
};

export {
  weddingInfo,
  daysInMonth,
  albumPage,
  albumA,
  albumB,
  albumC,
  albums,
  configConfetti,
  introSection,
  profileSection,
  invitationSection,
  albumSection,
  guestbookSection,
  giftSection,
  timerSection,
  finalSection,
  WISH_API_LINK,
  musicUrl,
  invitationDomain,
  metaData,
  creator,
};

