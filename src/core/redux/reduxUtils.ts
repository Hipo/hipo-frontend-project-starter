import {
  MinimalAsyncStoreState,
  TMinimalListState,
  TMinimalFormState
} from "./models/store";
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

function getMinimalAsyncListStoreState<T>(initialData: T[]): TMinimalListState<T> {
  return getMinimalAsyncStoreState(initialData);
}

function getMinimalFormStoreState<T>(initialData: T): TMinimalFormState<T> {
  return {...getMinimalAsyncStoreState(initialData), isPristine: true};
}

export {
  getMinimalAsyncStoreState,
  getMinimalAsyncListStoreState,
  getMinimalFormStoreState
};
