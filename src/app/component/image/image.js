import { useRef } from "react";
import { useInView } from "framer-motion";

function Image({ src }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const style = {
    transform: isInView ? "none" : "scale(0)",
    transition: "transform 2s cubic-bezier(0.17, 0.55, 0.55, 1) 0.3s",
  };
  return <img src={src} alt="Image" width="100%" ref={ref} style={style} />;
}

export default Image;
