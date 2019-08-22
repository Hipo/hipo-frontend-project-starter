import React, {Component, ErrorInfo} from "react";
import {sendSentryAnException} from "../sentryHandler";
import ErrorBoundaryFallback from "./ErrorBoundaryFallback";

type TErrorBoundaryState = ReturnType<typeof getInitialState>;

function getInitialState() {
  return Object.freeze({
    error: null as null | Error
  });
}

class ErrorBoundary extends Component<{}, TErrorBoundaryState> {
  /* eslint-disable react/sort-comp */
  readonly state = getInitialState();

  static getDerivedStateFromError(error: Error) {
    return {error};
  }
  /* eslint-enable react/sort-comp */

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error(error, errorInfo);

    sendSentryAnException(error, {
      title: "ErrorBoundary",
      data: errorInfo
    });
  }

  render() {
    const {error} = this.state;

    if (error) {
      // You can render any custom fallback UI
      return <ErrorBoundaryFallback error={error} />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
