import {HTTP_STATUS_CODES} from "../../core/network-manager/networkConstants";

const GENERIC_ERROR_MESSAGE = "Something went wrong, please try again later.";
const MANUALLY_CANCELLED_ERROR_TYPE = "ManuallyCancelled";

const HTTP_STATUS_CODE_ERROR_MESSAGE_MAP = {
  [HTTP_STATUS_CODES.TOO_LARGE]: "Please select a smaller file"
};

const ERROR_TYPES = [
  "PermissionDenied",
  "ValidationError",
  "Http404",
  "UnknownError",
  "FrontEnd",
  "Throttled",
  "ReducerFactory",
  "MethodNotAllowed",
  MANUALLY_CANCELLED_ERROR_TYPE
] as const;

export {
  GENERIC_ERROR_MESSAGE,
  HTTP_STATUS_CODE_ERROR_MESSAGE_MAP,
  MANUALLY_CANCELLED_ERROR_TYPE,
  ERROR_TYPES
};
