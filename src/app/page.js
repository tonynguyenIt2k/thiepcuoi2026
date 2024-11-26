import Home from "./pages/home/home";

export async function generateMetadata({ params, searchParams }, parent) {
  const previousImages = (await parent).openGraph?.images || [];

  const name = searchParams.name || "You";
  return {
    title: `Báo Hỉ Hùng - Thúy | Kính Mời ${name}`,
    openGraph: {
      images: [
        "https://res.cloudinary.com/do6sozxbo/image/upload/v1730558395/wedding5/land.jpg",
        ...previousImages,
      ],
    },
  };
}

export default function Page({ params, searchParams }) {
  // console.log(searchParams);
  return <Home />;
}
