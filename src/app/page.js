import Home from "./pages/home/home";
import { metaData } from "./configs/ui";
export async function generateMetadata({ params, searchParams }, parent) {
  const previousImages = (await parent).openGraph?.images || [];

  const name = searchParams.name || "You";
  return {
    title: `${metaData.main.title} ${name}`,
    openGraph: {
      images: [metaData.main.graphImage, ...previousImages],
    },
  };
}

export default function Page({ params, searchParams }) {
  // console.log(searchParams);
  return <Home />;
}
