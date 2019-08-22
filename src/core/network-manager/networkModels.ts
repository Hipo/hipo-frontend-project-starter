import {ERROR_TYPES} from "./networkConstants";

type TAccessToken = string | null;

interface ApiErrorDetailShape {
  non_field_errors?: string[];
  [x: string]: undefined | any;
}

interface ApiErrorShape {
  type: typeof ERROR_TYPES[number];
  detail: ApiErrorDetailShape;
  fallback_message: string;
}

type TRequestMethods = "get" | "post" | "put" | "patch" | "delete";

interface ApiListResponse<T = any> {
  count: number;
  next: null | string;
  previous: null | string;
  results: T;
}

type TApiMinimalListRequestParams<TOrderingValues = string> = Partial<{
  search: string;
  ordering: TOrderingValues;
  limit: number;
  offset: number;
}>;

export {
  TAccessToken,
  ApiErrorShape,
  TRequestMethods,
  ApiListResponse,
  TApiMinimalListRequestParams
};
