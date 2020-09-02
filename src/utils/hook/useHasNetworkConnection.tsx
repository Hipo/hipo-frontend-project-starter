import {useEffect, useState} from "react";

function useHasNetworkConnection() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    window.addEventListener("online", handleWindowOnline);
    window.addEventListener("offline", handleWindowOffline);

    return () => {
      window.removeEventListener("online", handleWindowOnline);
      window.removeEventListener("offline", handleWindowOffline);
    };
  }, []);

  function handleWindowOnline() {
    setIsOnline(true);
  }

  function handleWindowOffline() {
    setIsOnline(false);
  }

  return isOnline;
}

/* USAGE:

  const hasNetworkConnection = useHasNetworkConnection();

  useInterval(
    () => {
      setRetryCount(retryCount + 1);
      reconnect();
    },
    TWILIO_VIDEO_RECONNECTION_RETRY_INTERVAL,
    {
      shouldStartInterval:
        roomState === "disconnected" &&
        hasNetworkConnection &&
        !isTryingToReconnect &&
        hasRetryLimitLeft,
      shouldRunCallbackAtStart: true
    }
  );

*/

export default useHasNetworkConnection;
