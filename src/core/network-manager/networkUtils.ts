import {HTTP_STATUS_CODES} from "./networkConstants";
import {MANUALLY_CANCELLED_ERROR_TYPE} from "../../utils/error/errorConstants";
import {AuthenticationToken} from "../../authentication/util/authenticationManager";
import {createErrorWithApiErrorShapeFromString} from "../../utils/error/errorUtils";

function generateFinalError(error: any) {
  const unknownError = {
    data: createErrorWithApiErrorShapeFromString("An error occured", "UnknownError"),
    status: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
    message: "UnknownError",
    config: (error && error.config) || {}
  };

  let finalError = unknownError;

  if (error && typeof error === "object") {
    finalError = error.response || unknownError;

    if (error.message === MANUALLY_CANCELLED_ERROR_TYPE) {
      finalError = {
        ...unknownError,
        data: createErrorWithApiErrorShapeFromString(
          "Request manually cancelled",
          MANUALLY_CANCELLED_ERROR_TYPE
        ),
        message: MANUALLY_CANCELLED_ERROR_TYPE
      };
    }
  }

  return finalError;
}

function generateAuthorizationHeaderValue(token: AuthenticationToken) {
  return token ? `Token ${token}` : null;
}

function getNetworkBaseUrl() {
  return API_BASE_URL;
}

export {generateFinalError, generateAuthorizationHeaderValue, getNetworkBaseUrl};
