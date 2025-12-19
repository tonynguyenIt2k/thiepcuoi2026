import { metaData } from "../configs/ui";
import Wish from "../pages/wish";

export async function generateMetadata({ params, searchParams }, parent) {
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: metaData.wish.title,
    openGraph: {
      images: [metaData.wish.graphImage, ...previousImages],
    },
  };
}
function Page() {
  return <Wish />;
}

export default Page;
