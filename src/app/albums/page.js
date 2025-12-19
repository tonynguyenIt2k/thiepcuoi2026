import { metaData } from "../configs/ui";
import Album from "../pages/album";

export async function generateMetadata({}, parent) {
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: metaData.album.title,
    openGraph: {
      images: [metaData.album.graphImage, ...previousImages],
    },
  };
}

function Page({}) {
  return <Album />;
}

export default Page;
