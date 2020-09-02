import {useEffect, useState} from "react";

function useDebouncedValue<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/* USAGE:
  const debouncedFormState = useDebouncedValue(
    formState,
    250
  );
*/

export default useDebouncedValue;
