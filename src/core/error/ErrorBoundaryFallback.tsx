import React from "react";

import {isDevelopmentEnv, isProduction} from "../../utils/globalVariables";
import {showReportDialog} from "../sentryHandler";
import {generateErrorMessage} from "../../utils/error/errorUtils";

interface ErrorBoundaryFallbackProps {
  error: Error;
  eventId: string;
}

const JSON_STRINGIFY_CODE_SPACE = 4;

function ErrorBoundaryFallback({error, eventId}: ErrorBoundaryFallbackProps) {
  return (
    <div>
      <h5>{generateErrorMessage(error)}</h5>

      {!isDevelopmentEnv() && (
        <button onClick={handleReportButtonClick}>{"Report Feedback"}</button>
      )}

      {!isProduction() && (
        <>
          <hr />

          <pre className={"code-block"}>
            <code style={{whiteSpace: "pre-line"}}>
              {error instanceof Error
                ? error.stack
                : JSON.stringify(error, null, JSON_STRINGIFY_CODE_SPACE)}
            </code>
          </pre>
        </>
      )}
    </div>
  );

  function handleReportButtonClick() {
    showReportDialog(eventId);
  }
}

export default ErrorBoundaryFallback;
