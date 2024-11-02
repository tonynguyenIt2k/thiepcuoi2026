import images from "../images";

const link =
  "https://res.cloudinary.com/do6sozxbo/image/upload/f_auto,q_auto/v1/wedding5";

const link2 =
  "https://res.cloudinary.com/do6sozxbo/image/upload/f_auto,q_auto/v1/wedding5_1";
const weddingInfo = [
  {
    time: {
      date: "12/12",
      year: "2024",
      time: "11:00",
    },
    address:
      "Nhà hàng tiệc cưới Tám Khá, thôn 2 , Bình Minh, Bù Đăng, Bình Phước",
    street:
      "Nhà hàng tiệc cưới Tám Khá, thôn 2 , Bình Minh, Bù Đăng, Bình Phước",
    phone: "0979 700 113",
    posision: "bottom left",
  },
];

const profile = [
  {
    title: "bride",
    name: "Trần Thị Thúy",
    avatar: `${link}/bride1`,
    images: [`${link}/bride3`, `${link}/bride2`],
  },
  {
    title: "groom",
    name: "Lang Mạnh Hùng",
    avatar: `${link}/groom2`,

    images: [`${link}/groom3`, `${link}/groom1`],
  },
];

const daysInMonth = [
  {
    title: "mon",
    days: [2, 9, 16, 23, 30],
  },
  {
    title: "tue",
    days: [3, 10, 17, 24, 31],
  },
  {
    title: "wed",
    days: [4, 11, 18, 25, 0],
  },
  {
    title: "thu",
    days: [5, 12, 19, 26, 0],
  },
  {
    title: "fri",
    days: [6, 13, 20, 27, 0],
  },
  {
    title: "sat",
    days: [7, 14, 21, 27, 0],
  },
  {
    title: "sun",
    days: [1, 8, 15, 22, 29],
  },
];

const bank = {
  name: "Lang Mạnh Hùng",
  bankName: "MB Bank",
  bankNumber: "9999999996654",
};

const inv = [`${link}/inv1`, `${link}/inv2`, `${link}/inv3`];

const album = [
  `${link}/am1`,
  `${link}/am2`,
  `${link}/am3`,
  `${link}/am4`,
  `${link}/am5`,
  `${link}/am6`,
  `${link}/am7`,
  `${link}/am8`,
  `${link}/am9`,
  `${link}/am10`,
  `${link}/am11`,
  `${link}/am12`,
  `${link}/am13`,
];

const alland = [`${link}/aland1`, `${link}/aland2`];

const albumA = [
  {
    imgs: [
      {
        id: 1,
        img: `${link}/am7`,
      },

      {
        id: 2,
        img: `${link2}/c2`,
      },
      {
        id: 3,
        img: `${link2}/c3`,
      },
      {
        id: 4,
        img: `${link2}/c1`,
      },
    ],
  },

  {
    imgs: [
      {
        id: 5,
        img: `${link}/am5`,
      },
      {
        id: 6,
        img: `${link2}/c4`,
      },
      {
        id: 7,
        img: `${link2}/c5`,
      },
      {
        id: 8,
        img: `${link}/am10`,
      },
    ],
  },
  {
    imgs: [
      {
        id: 9,
        img: `${link}/am1`,
      },
      {
        id: 10,
        img: `${link}/am2`,
      },
      {
        id: 11,
        img: `${link}/am4`,
      },
      {
        id: 12,
        img: `${link}/am12`,
      },
    ],
  },
  {
    imgs: [
      {
        id: 13,
        img: `${link}/am9`,
      },

      {
        id: 14,
        img: `${link}/am8`,
      },
      {
        id: 15,
        img: `${link}/am13`,
      },
      {
        id: 16,
        img: `${link}/am6`,
      },
    ],
  },
];

const albumB = [
  {
    imgs: [
      {
        id: 17,
        img: `${link2}/b1`,
      },

      {
        id: 18,
        img: `${link2}/b2`,
      },
      {
        id: 19,
        img: `${link2}/b3`,
      },
    ],
  },

  {
    imgs: [
      {
        id: 20,
        img: `${link2}/b4`,
      },
      {
        id: 21,
        img: `${link2}/b5`,
      },
      {
        id: 22,
        img: `${link2}/b6`,
      },
    ],
  },
  {
    imgs: [
      {
        id: 23,
        img: `${link2}/b7`,
      },
      {
        id: 24,
        img: `${link2}/b8`,
      },
      {
        id: 25,
        img: `${link2}/b9`,
      },
    ],
  },
  {
    imgs: [
      {
        id: 26,
        img: `${link2}/b10`,
      },
      {
        id: 27,
        img: `${link2}/b11`,
      },
      {
        id: 28,
        img: `${link}/final1`,
      },
    ],
  },
];

const albumC = [
  {
    imgs: [
      {
        id: 29,
        img: `${link2}/a1`,
      },

      {
        id: 30,
        img: `${link2}/a3`,
      },
    ],
  },

  {
    imgs: [
      {
        id: 31,
        img: `${link2}/a5`,
      },
      {
        id: 32,
        img: `${link2}/a4`,
      },
    ],
  },
  {
    imgs: [
      {
        id: 33,
        img: `${link2}/a6`,
      },
    ],
  },
  {
    imgs: [
      {
        id: 34,
        img: `${link2}/a7`,
      },
    ],
  },
];

const finalImages = [
  `${link}/final1`,
  `${link}/final2`,
  `${link}/final3`,
  `${link}/final4`,
];

const albums = [...albumA, ...albumB, ...albumC];
export {
  weddingInfo,
  daysInMonth,
  profile,
  bank,
  album,
  finalImages,
  inv,
  alland,
  albumA,
  albumB,
  albumC,
  albums,
};
