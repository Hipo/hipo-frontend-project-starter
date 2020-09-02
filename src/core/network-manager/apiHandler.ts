import axios, {
  AxiosRequestConfig,
  CancelTokenSource,
  AxiosPromise,
  CancelToken
} from "axios";
import {CANCEL} from "redux-saga";

import {NetworkManagerShape} from "./NetworkManager";
import {MANUALLY_CANCELLED_ERROR_TYPE} from "../../utils/error/errorConstants";

type TRequestMethods = "get" | "post" | "put" | "patch" | "delete";

export interface ApiHandlerOptions {
  payload?: any;
  settings?: AxiosRequestConfig;
}

export type ApiHandlerCreator<T, ResponseType = any> = (
  arg: T,
  cancelToken?: CancelToken
) => AxiosPromise<ResponseType>;

const apiHandler = <ResponseType = any>(
  apiManager: NetworkManagerShape,
  method: TRequestMethods,
  url: string,
  options: ApiHandlerOptions = {
    payload: {},
    settings: {}
  }
): AxiosPromise<ResponseType> => {
  const settings = options.settings || {};
  const payload = options.payload || {};
  let source: CancelTokenSource;

  if (!settings.cancelToken) {
    source = axios.CancelToken.source();
    settings.cancelToken = source.token;
  }

  let request;

  if (method === "get") {
    request = apiManager.api.get(url, settings);
  } else if (method === "put") {
    request = apiManager.api.put(url, payload, settings);
  } else if (method === "patch") {
    request = apiManager.api.patch(url, payload, settings);
  } else if (method === "post") {
    request = apiManager.api.post(url, payload, settings);
  } else if (payload) {
    request = apiManager.api.delete(url, {data: payload, ...settings});
  } else {
    request = apiManager.api.delete(url, settings);
  }

  // @ts-ignore
  request[CANCEL] = () => source.cancel(MANUALLY_CANCELLED_ERROR_TYPE);

  return request;
};

export default apiHandler;
