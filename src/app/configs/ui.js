import images from "../images";

const link =
  "https://res.cloudinary.com/do6sozxbo/image/upload/f_auto,q_auto/v1/wedding5";

const link2 =
  "https://res.cloudinary.com/do6sozxbo/image/upload/f_auto,q_auto/v1/wedding5_1";

const weddingInfo = [
  {
    time: {
      date: "19/11",
      year: "2024",
      time: "11:00",
    },
    address: "XÓM 2, THÔN VÂN TIỀN, XÃ QUẢNG LƯU, QUẢNG TRẠCH, QUẢNG BÌNH",
    street: "XÓM 2, THÔN VÂN TIỀN, XÃ QUẢNG LƯU, QUẢNG TRẠCH, QUẢNG BÌNH",
    phone: "0375 889 827",
    posision: "bottom left",
  },
];

const profile = [
  {
    title: "bride",
    name: "Trần Thị Thúy",
    avatar: `${link}/bride6`,
    images: [`${link}/bride4`, `${link}/bride7`],
  },
  {
    title: "groom",
    name: "Lang Mạnh Hùng",
    avatar: `${link}/groom2`,

    images: [`${link}/groom3`, `${link}/groom1`],
  },
];

// const daysInMonth = [
//   {
//     title: "mon",
//     days: [2, 9, 16, 23, 30],
//   },
//   {
//     title: "tue",
//     days: [3, 10, 17, 24, 31],
//   },
//   {
//     title: "wed",
//     days: [4, 11, 18, 25, 0],
//   },
//   {
//     title: "thu",
//     days: [5, 12, 19, 26, 0],
//   },
//   {
//     title: "fri",
//     days: [6, 13, 20, 27, 0],
//   },
//   {
//     title: "sat",
//     days: [7, 14, 21, 27, 0],
//   },
//   {
//     title: "sun",
//     days: [1, 8, 15, 22, 29],
//   },
// ];

const daysInMonth = [
  {
    title: "mon",
    days: [4, 11, 18, 25, 0],
  },
  {
    title: "tue",
    days: [5, 12, 19, 26, 0],
  },
  {
    title: "wed",
    days: [6, 13, 20, 27, 0],
  },
  {
    title: "thu",
    days: [7, 14, 21, 28, 0],
  },
  {
    title: "fri",
    days: [1, 8, 15, 22, 29],
  },
  {
    title: "sat",
    days: [2, 9, 16, 23, 30],
  },
  {
    title: "sun",
    days: [3, 10, 17, 24, 0],
  },
];

const bank = {
  name: "Trần Thị Thuý",
  bankName: "Vietinbank ",
  bankNumber: "107880386791",
};

const inv = [`${link}/e7`, `${link}/e4`, `${link}/e6`];

const album = [
  `${link}/e1`,
  `${link}/e3`,
  `${link}/e4`,
  `${link}/e5`,
  `${link}/e7`,
  `${link}/e8`,
];

const alland = [`${link}/aland3`, `${link}/aland2`];

const albumA = [
  {
    imgs: [
      {
        id: 1,
        img: `${link}/e1`,
      },

      {
        id: 2,
        img: `${link}/e4`,
      },
    ],
  },

  {
    imgs: [
      {
        id: 3,
        img: `${link}/e3`,
      },
      {
        id: 4,
        img: `${link}/e5`,
      },
    ],
  },

  {
    imgs: [
      {
        id: 5,
        img: `${link}/e6`,
      },
      {
        id: 6,
        img: `${link}/e7`,
      },
    ],
  },

  {
    imgs: [
      {
        id: 7,
        img: `${link}/e8`,
      },
      {
        id: 8,
        img: `${link}/groom3`,
      },
    ],
  },
];

const albumB = [
  {
    imgs: [
      {
        id: 9,
        img: `${link}/e9`,
      },
    ],
  },

  {
    imgs: [
      {
        id: 10,
        img: `${link}/e13`,
      },
    ],
  },
  {
    imgs: [
      {
        id: 11,
        img: `${link}/e10`,
      },
    ],
  },
  {
    imgs: [
      {
        id: 12,
        img: `${link}/e11`,
      },
    ],
  },
];

const albumC = [
  {
    imgs: [
      {
        id: 13,
        img: `${link}/e15`,
      },
    ],
  },
  {
    imgs: [
      {
        id: 14,
        img: `${link}/e14`,
      },
    ],
  },
  {
    imgs: [
      {
        id: 15,
        img: `${link}/e16`,
      },
    ],
  },
  {
    imgs: [
      {
        id: 16,
        img: `${link}/e17`,
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
