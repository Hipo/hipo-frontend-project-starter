import ExceptionTransformer from "@hipo/hipo-exceptions-js";

import {ApiErrorShape} from "../../core/network-manager/networkModels";
import {GENERIC_ERROR_MESSAGE, ERROR_TYPES} from "./errorConstants";
import {ArrayToUnion} from "../typeUtils";
import {isProduction} from "../globalVariables";
import {sendSentryAnException} from "../../core/sentryHandler";

const exceptionTransformer = new ExceptionTransformer(GENERIC_ERROR_MESSAGE, {
  onUnexpectedException: sendSentryAnException
});

function generateErrorMessage(
  errorInfo: ApiErrorShape | null | Error,
  options?: {
    skipTypes?: Array<ArrayToUnion<typeof ERROR_TYPES>>;
    knownErrorKeys?: string[] | null;
  }
) {
  let message = "";

  if (errorInfo) {
    if (errorInfo instanceof Error) {
      message = errorInfo.message || GENERIC_ERROR_MESSAGE;
    } else {
      message = exceptionTransformer.generateErrorMessage(errorInfo, options);
    }
  }
  return message;
}

function generateSpecificFieldError(errorInfo: ApiErrorShape | null | undefined) {
  return exceptionTransformer.generateSpecificFieldError(errorInfo);
}

function generateErrorMessageFromCaughtError(error: any) {
  let errorObj = error.data;

  if (error instanceof Error || typeof error.fallback_message !== "undefined") {
    errorObj = error;
  }

  return generateErrorMessage(errorObj);
}

function throwError(errorString: string) {
  if (!isProduction()) {
    throw new Error(errorString);
  }
}

function createErrorWithApiErrorShapeFromString(
  text: string,
  type: ArrayToUnion<typeof ERROR_TYPES> = "FrontEnd"
): ApiErrorShape {
  return {
    type,
    detail: {
      non_field_errors: [text]
    },
    fallback_message: text
  };
}

export {
  generateErrorMessage,
  generateSpecificFieldError,
  generateErrorMessageFromCaughtError,
  throwError,
  createErrorWithApiErrorShapeFromString
};
