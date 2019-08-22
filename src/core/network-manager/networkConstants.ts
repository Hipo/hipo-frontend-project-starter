import {ApiErrorShape} from "./networkModels";

const JSON_CONTENT_TYPE = "application/json";
const FORM_DATA_CONTENT_TYPE = "multipart/form-data";
const CONTENT_TYPE_HEADER = "Content-Type";
const REQUEST_TYPES_WITH_BODY = ["post", "put", "patch"];

const MULTI_PART_REQUEST_HEADERS = {
  [CONTENT_TYPE_HEADER]: [FORM_DATA_CONTENT_TYPE]
};

const HTTP_STATUS_CODES = {
  FORBIDDEN: 403,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  TOO_LARGE: 413
};

const DEFAULT_LIST_ITEMS_LIMIT_PER_PAGE = 10;
const POLLING_INTERVAL = 30000;

const MANUALLY_CANCELLED_ERROR_TYPE = "ManuallyCancelled";

const ERROR_TYPES = [
  "PermissionDenied",
  "ValidationError",
  "Http404",
  "UnknownError",
  "FrontEnd",
  MANUALLY_CANCELLED_ERROR_TYPE
] as const;

const UNKNOWN_ERROR_DATA: ApiErrorShape = {
  type: "UnknownError",
  detail: {},
  fallback_message: "An error occured"
};

const UNKNOWN_ERROR = {
  data: UNKNOWN_ERROR_DATA,
  status: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
  message: "UnknownError",
  config: {} as any
};

export {
  JSON_CONTENT_TYPE,
  CONTENT_TYPE_HEADER,
  REQUEST_TYPES_WITH_BODY,
  HTTP_STATUS_CODES,
  FORM_DATA_CONTENT_TYPE,
  MANUALLY_CANCELLED_ERROR_TYPE,
  DEFAULT_LIST_ITEMS_LIMIT_PER_PAGE,
  MULTI_PART_REQUEST_HEADERS,
  POLLING_INTERVAL,
  ERROR_TYPES,
  UNKNOWN_ERROR
};
