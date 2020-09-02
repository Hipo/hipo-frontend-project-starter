import React, {useEffect, useRef} from "react";
import {History} from "history";

function useOnNavigatingAwayFromSubroute(
  callback: () => void,
  history: History,
  subRouteRegex: RegExp
) {
  const savedCallback = useRef<VoidFunction>();

  useEffect(() => {
    savedCallback.current = callback;
  });

  React.useEffect(() => {
    const listener = history.listen((location) => {
      if (savedCallback.current && !subRouteRegex.test(location.pathname)) {
        savedCallback.current();
      }
    });

    return () => {
      listener();
    };
  }, [history, subRouteRegex]);
}

/* USAGE:

  useOnNavigatingAwayFromSubroute(
    () => {
      dispatchReduxAction(eventDetailReduxStateNamespace.actionCreators.cancel());
    },
    history,
    ROOT_EVENT_DETAIL_ROUTE_REGEX
  );

*/

export default useOnNavigatingAwayFromSubroute;
