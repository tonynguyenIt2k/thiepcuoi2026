import images from "../images";

const WISH_API_LINK = ""; // use mock api
const cdnLink =
  "https://res.cloudinary.com/do6sozxbo/image/upload/f_auto,q_auto/v1/wedding5";

// common

// config Confetti

const configConfetti = {
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

const weddingInfo = [
  {
    time: {
      date: "22/12",
      year: "2024",
      time: "11:00",
      full: "Chủ nhật, Ngày 22 Tháng 12 năm 2024",
    },
    address: "Tổ 23A , xã tân lập , huyện đồng phú , tỉnh bình phước",
    street: "Tổ 23A , xã tân lập , huyện đồng phú , tỉnh bình phước",
    phone: "0375 889 827",
    posision: "bottom left",
  },
];

// December
const daysInMonth = [
  {
    title: "mon",
    days: [0, 2, 9, 16, 23, 30],
  },
  {
    title: "tue",
    days: [0, 3, 10, 17, 24, 31],
  },
  {
    title: "wed",
    days: [0, 4, 11, 18, 25, 0],
  },
  {
    title: "thu",
    days: [0, 5, 12, 19, 26, 0],
  },
  {
    title: "fri",
    days: [0, 6, 13, 20, 27, 0],
  },
  {
    title: "sat",
    days: [0, 7, 14, 21, 27, 0],
  },
  {
    title: "sun",
    days: [1, 8, 15, 22, 29, 0],
  },
];

// invitation intro (first section)
const introSection = {
  mainImage:
    "https://res.cloudinary.com/do6sozxbo/image/upload/f_auto,q_auto/v1/wedding5/e3",
  brideFirstLetter: "T",
  groomFirstLetter: "H",
};

// profile section

const profileSection = {
  description:
    "Hôn nhân không phải là một điểm đến mà là một cuộc hành trình nơi mà hai người cùng xây dựng và phát triển",
  profiles: [
    {
      title: "bride",
      name: "Trần Thị Thúy",
      avatar: `${cdnLink}/bride6`,
      images: [`${cdnLink}/bride4`, `${cdnLink}/bride7`],
    },
    {
      title: "groom",
      name: "Lang Mạnh Hùng",
      avatar: `${cdnLink}/groom2`,
      images: [`${cdnLink}/groom3`, `${cdnLink}/groom1`],
    },
  ],
};

// invitation section

const invitationSection = {
  imgs: [`${cdnLink}/e7`, `${cdnLink}/e4`, `${cdnLink}/e6`],
  activeDay: 22,
};

// album section

const albumSection = {
  images: [
    `${cdnLink}/e1`,
    `${cdnLink}/e3`,
    `${cdnLink}/e4`,
    `${cdnLink}/e5`,
    `${cdnLink}/e7`,
    `${cdnLink}/e8`,
  ],
};

// guestbook section

const guestbookSection = {
  image: `${cdnLink}/e5`,
  time: "12/12/2024",
};

// gift section

const giftSection = {
  image:
    "https://res.cloudinary.com/do6sozxbo/image/upload/v1730383598/wedding5/am3.jpg",
  brideBank: {
    name: "Trần Thị Thuý",
    bankName: "Vietinbank ",
    qr: images.qr2.default.src,
    bankNumber: "107880386791",
  },
  groomBank: {
    name: "Lang Mạnh Hùng",
    bankName: "MB BANK",
    qr: images.qr.default.src,
    bankNumber: "9999999996654",
  },
};

// timer
const timerSection = {
  weddingTime: {
    year: 2024,
    day: 22,
    month: 12,
  },
};

// final section

const finalSection = {
  images: [
    `${cdnLink}/final1`,
    `${cdnLink}/final2`,
    `${cdnLink}/final3`,
    `${cdnLink}/final4`,
  ],
};

// Album Page

const albumPage = {
  topImage: `${cdnLink}/aland3`,
  bottomImage: `${cdnLink}/aland2`,
  mainImage: `${cdnLink}/e1`,
};

const albumA = [
  {
    imgs: [
      {
        id: 1,
        img: `${cdnLink}/e1`,
      },

      {
        id: 2,
        img: `${cdnLink}/e4`,
      },
    ],
  },

  {
    imgs: [
      {
        id: 3,
        img: `${cdnLink}/e3`,
      },
      {
        id: 4,
        img: `${cdnLink}/e5`,
      },
    ],
  },

  {
    imgs: [
      {
        id: 5,
        img: `${cdnLink}/e6`,
      },
      {
        id: 6,
        img: `${cdnLink}/e7`,
      },
    ],
  },

  {
    imgs: [
      {
        id: 7,
        img: `${cdnLink}/e8`,
      },
      {
        id: 8,
        img: `${cdnLink}/groom3`,
      },
    ],
  },
];

const albumB = [
  {
    imgs: [
      {
        id: 9,
        img: `${cdnLink}/e9`,
      },
    ],
  },

  {
    imgs: [
      {
        id: 10,
        img: `${cdnLink}/e13`,
      },
    ],
  },
  {
    imgs: [
      {
        id: 11,
        img: `${cdnLink}/e10`,
      },
    ],
  },
  {
    imgs: [
      {
        id: 12,
        img: `${cdnLink}/e11`,
      },
    ],
  },
];

const albumC = [
  {
    imgs: [
      {
        id: 13,
        img: `${cdnLink}/e15`,
      },
    ],
  },
  {
    imgs: [
      {
        id: 14,
        img: `${cdnLink}/e14`,
      },
    ],
  },
  {
    imgs: [
      {
        id: 15,
        img: `${cdnLink}/e16`,
      },
    ],
  },
  {
    imgs: [
      {
        id: 16,
        img: `${cdnLink}/e17`,
      },
    ],
  },
];

const albums = [...albumA, ...albumB, ...albumC]; // for preview

const metaData = {
  main: {
    title: "Báo Hỉ Hùng - Thúy | Kính Mời",
    graphImage:
      "https://res.cloudinary.com/do6sozxbo/image/upload/v1730558395/wedding5/land.jpg",
  },

  wish: {
    title: "Tất cả lời chúc dành cho Hùng - Thúy",
    graphImage:
      "https://res.cloudinary.com/do6sozxbo/image/upload/v1730558395/wedding5/am11.jpg",
  },

  invitation: {
    title: "Báo Hỉ | Form Nhập Tên",
    graphImage:
      "https://res.cloudinary.com/do6sozxbo/image/upload/v1730394150/wedding5_1/a3.jpg",
  },
  album: {
    title: "Album của Hùng - Thúy`",
    graphImage:
      "https://res.cloudinary.com/do6sozxbo/image/upload/v1730558395/wedding5/final3.jpg",
  },
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
  metaData,
};
