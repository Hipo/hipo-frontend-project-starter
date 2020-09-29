import React from "react";
import {Location} from "history";

import useCurrentLocationRefresh from "./useCurrentLocationRefresh";

function useDebounceHandler(
  debouncedHandler: any,
  initialValue: any,
  delay: number,
  location: Location
) {
  const [value, setValue] = React.useState(initialValue);
  const currentValueRef = React.useRef(value);

  // force reset value on location refresh
  useCurrentLocationRefresh(() => {
    setValue("");
  }, location);

  React.useEffect(() => {
    let handler: any;

    if (currentValueRef.current !== value) {
      handler = setTimeout(() => {
        debouncedHandler(value);
      }, delay);

      currentValueRef.current = value;
    }

    return () => {
      clearTimeout(handler);
    };
  }, [currentValueRef, debouncedHandler, value, delay]);

  return [value, setValue];
}

/* USAGE:

  const [inputValue, setInputValue] = useDebounce(
    (value: string) => {
      console.log(value);
    },
    value,
    250,
    useLocation()
  );

*/

export default useDebounceHandler;
