import { metaData } from "../configs/ui";
import Invitation from "../pages/invitation";

export async function generateMetadata({ params, searchParams }, parent) {
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: metaData.invitation.title,
    openGraph: {
      images: [metaData.invitation.graphImage, ...previousImages],
    },
  };
}

function Page() {
  return <Invitation />;
}

export default Page;
