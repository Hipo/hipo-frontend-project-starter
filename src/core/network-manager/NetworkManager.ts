import axios, {AxiosRequestConfig, AxiosInstance} from "axios";

import {
  REQUEST_TYPES_WITH_BODY,
  CONTENT_TYPE_HEADER,
  JSON_CONTENT_TYPE,
  HTTP_STATUS_CODES,
  MANUALLY_CANCELLED_ERROR_TYPE
} from "./networkConstants";
import {generateFinalError, generateAuthorizationHeaderValue} from "./networkUtils";
import {TAccessToken} from "./networkModels";

const BASE_CONFIG: AxiosRequestConfig = {
  baseURL: API_BASE_URL
};

export interface NetworkManagerShape {
  api: AxiosInstance;
  updateToken: (x: TAccessToken) => void;
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

  updateToken(token: TAccessToken) {
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
            window.location.href = "/not-found";
          } else if (status === HTTP_STATUS_CODES.FORBIDDEN) {
            //   sendSentryAnException(finalError);

            throw new Error(JSON.stringify(finalError));
          } else if (status >= HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR) {
            //   sendSentryAnException(finalError);
          } else {
            const {fallback_message, detail} = finalError.data;

            if (!fallback_message) {
              // sendSentryAnException(finalError);
            } else if (
              !detail ||
              typeof detail !== "object" ||
              !Object.keys(detail).length
            ) {
              // sendSentryAnException(finalError);
            }
          }
        }

        return Promise.reject(finalError);
      }
    );
  }
}

export default NetworkManager;
