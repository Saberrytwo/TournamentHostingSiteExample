// useScreenSize.js
import { useEffect, useState } from "react";

const useScreenSize = () => {
  const baseFontSizeInPixels = 16;
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth / baseFontSizeInPixels,
    height: window.innerHeight / baseFontSizeInPixels,
  });

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth / baseFontSizeInPixels,
        height: window.innerHeight / baseFontSizeInPixels,
      });
    };

    window.addEventListener("resize", handleResize);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return screenSize;
};

export default useScreenSize;
