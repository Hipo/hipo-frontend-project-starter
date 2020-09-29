import {useRef, useLayoutEffect, MutableRefObject} from "react";

type TScrollEffectCallback = () => void;

export interface ScrollHookOptions {
  element?: MutableRefObject<HTMLElement | null>;
  useWindow?: boolean;
  delay?: null | number;
}

const scrollEventTimeout = 200;

function useScroll(
  effect: TScrollEffectCallback,
  deps: any[],
  options?: ScrollHookOptions
) {
  const {delay = scrollEventTimeout, element = null, useWindow = true} = options || {};
  let targetElement: HTMLElement | Window = element?.current
    ? element.current
    : document.body;

  if (useWindow) {
    targetElement = window;
  }

  const timeoutId = useRef(undefined as any);

  useLayoutEffect(() => {
    targetElement.addEventListener("scroll", handleScroll);

    return () => {
      targetElement.removeEventListener("scroll", handleScroll);
      clearTimeout(timeoutId.current);
    };

    function handleScroll() {
      if (typeof delay === "number") {
        if (!timeoutId.current) {
          timeoutId.current = setTimeout(scrollCallback, delay);
        }
      } else {
        scrollCallback();
      }
    }
    // eslint-disable-next-line
  }, [targetElement, delay, ...(deps || [])]);

  function scrollCallback() {
    effect();
    timeoutId.current = null;
  }
}

/* USAGE:

  useScroll(
    () => {
      // if there is `next` and the last thread item is visible, request for the next pagination
      if (listContainerElementRef.current && listElementRef.current && nextUrl) {
        const scrollingElement = listContainerElementRef.current;
        const lastListItemElement = listElementRef.current.lastElementChild;

        if (
          lastListItemElement &&
          isLastElementVisible(scrollingElement, lastListItemElement.clientHeight) &&
          !canRequestForNext
        ) {
          dispatchStateReducerAction({
            type: "REQUEST_FOR_NEXT",
            payload: true
          });
        }
      }
    },
    [canRequestForNext, nextUrl],
    {
      useWindow: false,
      element: listContainerElementRef
    }
  );

*/

export default useScroll;
