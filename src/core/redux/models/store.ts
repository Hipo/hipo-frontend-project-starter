import {ApiErrorShape} from "../../network-manager/networkModels";
import {AuthenticationState} from "../../../authentication/redux/authenticationState";

interface ReduxStoreShape {
  authenticationState: AuthenticationState;
}

interface MinimalAsyncStoreState<Data = any, ApiHandlerArgument = any> {
  isRequestPending: boolean;
  isRequestFetched: boolean;
  data: Data | null;
  errorInfo: ApiErrorShape | null;
  requestPayload?: ApiHandlerArgument;
}

export {ReduxStoreShape, MinimalAsyncStoreState};
