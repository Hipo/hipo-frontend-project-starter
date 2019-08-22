import React from "react";
import {isDevelopmentEnv} from "../../utils/globalVariables";
import {showReportDialog} from "../sentryHandler";

interface ErrorBoundaryFallbackProps {
  error: Error;
}

const JSON_STRINGIFY_CODE_SPACE = 4;

function ErrorBoundaryFallback(props: ErrorBoundaryFallbackProps) {
  return (
    <div>
      <h5>{"An error occured in the application."}</h5>

      {isDevelopmentEnv() ? (
        <>
          <hr />

          <pre>
            <code>{JSON.stringify(props.error, null, JSON_STRINGIFY_CODE_SPACE)}</code>
          </pre>
        </>
      ) : (
        <button onClick={showReportDialog}>{"Report feedback"}</button>
      )}
    </div>
  );
}

export default ErrorBoundaryFallback;
