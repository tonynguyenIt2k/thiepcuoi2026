import GlobalContext from "./context";
import "./globals.css";
import Sublayout from "./subLayout";

export async function generateMetadata({ params, request }) {
  // const name = searchParams ? decodeURIComponent(searchParams.get("name")) : "";
  const name = "";
  return {
    title: `Thiệp cưới của Hùng | Kính Mời ${name}`,
    description: `Chúng tôi trân trọng kính mời bạn đến dự lễ cưới . Hãy cùng chúng tôi tạo nên những kỷ niệm đẹp trong ngày trọng đại này!`,
    openGraph: {
      images: [
        "https://res.cloudinary.com/do6sozxbo/image/upload/v1730558395/wedding5/land.jpg",
      ],
    },

    twitter: {
      images: [
        "https://res.cloudinary.com/do6sozxbo/image/upload/v1730558395/wedding5/land.jpg",
      ],
    },
    metadataBase: new URL("https://thiep-cuoi-hung-thuy.vercel.app"),
  };
}

export default function RootLayout({ children }) {
  return (
    // <Suspense fallback={<div>Loading ...</div>}>
    <html lang="vi">
      <body>
        <GlobalContext>
          <Sublayout>{children}</Sublayout>
        </GlobalContext>
      </body>
    </html>
    // </Suspense>
  );
}
