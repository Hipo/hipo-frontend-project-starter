import {useEffect, useRef} from "react";

interface IntervalHookOptions {
  shouldStartInterval?: boolean;
  // Normally, callback will be called at the end of first interval for the first time,
  // this option overrides it to run as soon as the interval starts
  shouldRunCallbackAtStart?: boolean;
}

function useInterval(
  callback: VoidFunction,
  delay: number,
  options: IntervalHookOptions = {
    shouldStartInterval: true,
    shouldRunCallbackAtStart: false
  }
) {
  const {shouldStartInterval, shouldRunCallbackAtStart} = options;
  const savedCallback = useRef<VoidFunction>();

  useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
    if (shouldStartInterval && shouldRunCallbackAtStart && savedCallback.current) {
      savedCallback.current();
    }
  }, [shouldStartInterval, shouldRunCallbackAtStart]);

  useEffect(() => {
    let id: NodeJS.Timeout;

    if (shouldStartInterval) {
      id = setInterval(tick, delay);
    }

    return () => {
      if (shouldStartInterval) {
        clearInterval(id);
      }
    };

    function tick() {
      savedCallback.current!();
    }
  }, [delay, shouldStartInterval]);
}

/* USAGE:

  useInterval(
    () => setShouldGetDocumentPackage(true),
    GET_DOCUMENT_PACKAGE_REQUEST_POLLING_INTERVAL,
    {
      shouldStartInterval: isCreateDocumentPackageRequested,
      shouldRunCallbackAtStart: true
    }
  );

*/

export default useInterval;
