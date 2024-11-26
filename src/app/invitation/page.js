import Invitation from "../pages/invitation";

export async function generateMetadata({ params, searchParams }, parent) {
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `Báo Hỉ | Form Nhập Tên`,
    openGraph: {
      images: [
        "https://res.cloudinary.com/do6sozxbo/image/upload/v1730394150/wedding5_1/a3.jpg",
        ...previousImages,
      ],
    },
  };
}

function Page() {
  return <Invitation />;
}

export default Page;
