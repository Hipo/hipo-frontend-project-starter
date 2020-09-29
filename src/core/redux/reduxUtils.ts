import {MinimalAsyncStoreState} from "./models/store";
import {ApiErrorShape} from "../network-manager/networkModels";

function getMinimalAsyncStoreState<T>(
  initialData: T | null = null
): MinimalAsyncStoreState<T> {
  return {
    isRequestPending: false,
    isRequestFetched: false,
    data: initialData,
    errorInfo: null as ApiErrorShape | null
  };
}

export {getMinimalAsyncStoreState};
