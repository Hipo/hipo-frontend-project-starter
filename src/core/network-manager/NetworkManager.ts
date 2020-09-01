import axios, {AxiosRequestConfig, AxiosInstance} from "axios";

import {
  REQUEST_TYPES_WITH_BODY,
  CONTENT_TYPE_HEADER,
  JSON_CONTENT_TYPE,
  HTTP_STATUS_CODES
} from "./networkConstants";
import {
  generateFinalError,
  generateAuthorizationHeaderValue,
  getNetworkBaseUrl
} from "./networkUtils";
import {MANUALLY_CANCELLED_ERROR_TYPE} from "../../utils/error/errorConstants";
import {AuthenticationToken} from "../../authentication/util/authenticationManager";
import {stringifySearchParamsObject} from "../../utils/url/urlUtils";

const BASE_CONFIG: AxiosRequestConfig = {
  baseURL: getNetworkBaseUrl(),
  paramsSerializer(params) {
    return params ? stringifySearchParamsObject(params) : "";
  }
};

export interface NetworkManagerShape {
  api: AxiosInstance;
  updateToken: (x: AuthenticationToken) => void;
}

class NetworkManager implements NetworkManagerShape {
  api: AxiosInstance;
  latestConfig: AxiosRequestConfig;

  constructor(customConfig: AxiosRequestConfig = {}) {
    this.latestConfig = {
      ...BASE_CONFIG,
      ...customConfig,
      headers: {
        ...BASE_CONFIG.headers,
        ...customConfig.headers,
        common: {
          ...(BASE_CONFIG.headers || {}).common,
          ...(customConfig.headers || {}).common
        }
      }
    };

    this.api = NetworkManager.createInstance(this.latestConfig);
  }

  updateToken(token: AuthenticationToken) {
    const newNetworkConfig = {
      ...this.latestConfig
    };

    newNetworkConfig.headers = {
      ...newNetworkConfig.headers,
      common: {
        ...newNetworkConfig.headers.common,
        Authorization: generateAuthorizationHeaderValue(token)
      }
    };

    this.api = NetworkManager.createInstance(newNetworkConfig);
  }

  static createInstance(config: AxiosRequestConfig) {
    const instance = axios.create(config);

    REQUEST_TYPES_WITH_BODY.forEach((requestType) => {
      instance.defaults.headers[requestType][CONTENT_TYPE_HEADER] = JSON_CONTENT_TYPE;
    });

    NetworkManager.setInterceptors(instance);

    return instance;
  }

  static setInterceptors(instance: AxiosInstance) {
    instance.interceptors.request.use((config) => {
      // add trailing slash to the request url if forgotten
      if (config.url && config.url[config.url.length - 1] !== "/") {
        config.url += "/";
      }

      return config;
    });

    instance.interceptors.response.use(
      (response) => response,
      (error) => {
        const finalError = generateFinalError(error);

        if (finalError.data.type !== MANUALLY_CANCELLED_ERROR_TYPE) {
          const {status} = finalError;

          if (status === HTTP_STATUS_CODES.UNAUTHORIZED) {
            window.location.href = "/login";
          } else if (status === HTTP_STATUS_CODES.NOT_FOUND) {
            console.error(error);
          } else if (status === HTTP_STATUS_CODES.FORBIDDEN) {
            // sendSentryAnException(finalError);
          }
        }

        return Promise.reject(finalError);
      }
    );
  }
}

export default NetworkManager;
