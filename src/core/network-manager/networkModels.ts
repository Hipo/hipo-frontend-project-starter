import {ERROR_TYPES} from "../../utils/error/errorConstants";
import {ArrayToUnion} from "../../utils/typeUtils";

interface ApiErrorDetailShape {
  [x: string]: undefined | any;
}

interface ApiErrorShape {
  type: ArrayToUnion<typeof ERROR_TYPES>;
  detail: ApiErrorDetailShape;
  fallback_message: string;
}

type TRequestMethods = "get" | "post" | "put" | "patch" | "delete";

interface ApiListResponse<T = any> {
  count: number;
  next: null | string;
  previous: null | string;
  results: T[];
}

type ApiMinimalListRequestQueryParams<OrderingValues = string> = Partial<{
  search: string;
  ordering: OrderingValues;
  limit: number;
  offset: number;
}>;

interface ApiRangeModel {
  lower: number;
  upper: number;
}

export {
  ApiErrorShape,
  TRequestMethods,
  ApiListResponse,
  ApiMinimalListRequestQueryParams,
  ApiRangeModel
};
