import Home from "./pages/home/home";
import { metaData } from "./configs/ui";

export const metadata = {
  title: metaData.main.title,
  openGraph: {
    images: [metaData.main.graphImage],
  },
};

export default function Page() {
  return <Home />;
}

