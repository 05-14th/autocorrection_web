import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToHashElement: React.FC = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.substring(1)); // remove the "#" from hash
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [hash]);

  return null;
};

export default ScrollToHashElement;
