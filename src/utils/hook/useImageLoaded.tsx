import {MutableRefObject, useEffect} from "react";

function useImageLoaded(
  imgRef: MutableRefObject<HTMLImageElement | null>,
  callback: () => void
) {
  useEffect(() => {
    const imgTag = imgRef.current;

    if (imgTag) {
      imgTag.addEventListener("load", callback);
    }

    return () => {
      if (imgTag) {
        imgTag.removeEventListener("load", callback);
      }
    };
  }, [imgRef, callback]);
}

/* USAGE:

  useImageLoad(
    imgRef,
    useCallback(() => {
      setIsImgLoadedState(true);
    }, [])
  );

*/

export default useImageLoaded;
