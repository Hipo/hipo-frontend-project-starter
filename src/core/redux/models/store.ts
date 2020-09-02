import {ApiErrorShape} from "../../network-manager/networkModels";
import {AuthenticationState} from "../../../authentication/redux/authenticationState";

interface ReduxStoreShape {
  authenticationState: AuthenticationState;
}

interface MinimalAsyncStoreState<T = any> {
  isRequestPending: boolean;
  isRequestFetched: boolean;
  data: T | null;
  errorInfo: ApiErrorShape | null;
}

export {ReduxStoreShape, MinimalAsyncStoreState};
