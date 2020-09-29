import React, {useRef} from "react";
import {Location} from "history";

function useCurrentLocationRefresh(
  callback: () => void,
  {search, key, pathname}: Location<any>
) {
  const initialPathnameRef = useRef(pathname);
  const currentKeyRef = useRef(key);

  React.useEffect(() => {
    // Refresh only if location.pathname is same and location.search=="" and location.key has changed
    if (
      initialPathnameRef.current === pathname &&
      search === "" &&
      currentKeyRef.current !== key
    ) {
      callback();

      currentKeyRef.current = key;
    }
  }, [callback, key, search, pathname]);
}

/* USAGE:
  useCurrentLocationRefresh(() => {
    dispatchInvestorListStateReducerAction({
      type: "RESET_FILTERS",
      payload: {
        selectedSortingItem: tableHeaderItems[0]
      }
    });
  }, location);
*/

export default useCurrentLocationRefresh;
