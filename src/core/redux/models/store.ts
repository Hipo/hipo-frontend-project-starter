import {ApiErrorShape} from "../../network-manager/networkModels";
import {TAuthenticationState} from "../../../authentication/redux/authenticationState";

interface ReduxStoreShape {
  authenticationState: TAuthenticationState;
}

interface MinimalAsyncStoreState<T = any> {
  isRequestPending: boolean;
  isRequestFetched: boolean;
  data: T | null;
  errorInfo: ApiErrorShape | null;
}

type TMinimalListState<T = any> = MinimalAsyncStoreState<T[]> & {
  count?: number;
  next?: string;
  previous?: string;
};

type TMinimalFormState<T = any> = MinimalAsyncStoreState<T> & {
  isPristine?: boolean;
};

export {ReduxStoreShape, MinimalAsyncStoreState, TMinimalListState, TMinimalFormState};
