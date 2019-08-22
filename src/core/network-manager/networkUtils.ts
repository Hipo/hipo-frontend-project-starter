import {UNKNOWN_ERROR, MANUALLY_CANCELLED_ERROR_TYPE} from "./networkConstants";
import {TAccessToken} from "./networkModels";

function generateFinalError(error: any) {
  const unknownError = {
    ...UNKNOWN_ERROR,
    config: (error && error.config) || UNKNOWN_ERROR.config
  };

  let finalError = unknownError;

  if (error && typeof error === "object") {
    finalError = error.response || unknownError;

    if (error.message === MANUALLY_CANCELLED_ERROR_TYPE) {
      finalError = {
        ...unknownError,
        data: {
          type: MANUALLY_CANCELLED_ERROR_TYPE,
          detail: {},
          fallback_message: "Request manually cancelled"
        },
        message: MANUALLY_CANCELLED_ERROR_TYPE
      };
    }
  }

  return finalError;
}

function generateAuthorizationHeaderValue(token: TAccessToken) {
  return token ? `Token ${token}` : null;
}

export {generateFinalError, generateAuthorizationHeaderValue};
