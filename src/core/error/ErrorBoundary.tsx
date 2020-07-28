import React, {Component, ErrorInfo} from "react";

import ErrorBoundaryFallback from "./ErrorBoundaryFallback";
import {sendSentryAnException} from "../../core/sentryHandler";

type TErrorBoundaryState = ReturnType<typeof getInitialState>;

function getInitialState() {
  return Object.freeze({
    error: null as null | Error,
    eventId: ""
  });
}

class ErrorBoundary extends Component<Record<string, unknown>, TErrorBoundaryState> {
  /* eslint-disable react/sort-comp */
  readonly state = getInitialState();

  static getDerivedStateFromError(error: Error) {
    return {error};
  }
  /* eslint-enable react/sort-comp */

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    sendSentryAnException(
      error,
      {
        title: "ErrorBoundary",
        data: errorInfo
      },
      this.setSentryEventId
    );
  }

  setSentryEventId = (eventId: string) => {
    this.setState({
      eventId
    });
  };

  render() {
    const {error, eventId} = this.state;

    if (error) {
      return <ErrorBoundaryFallback error={error} eventId={eventId} />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
