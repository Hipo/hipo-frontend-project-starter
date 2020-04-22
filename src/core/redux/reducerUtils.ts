import {combineReducers} from "redux";

import {ReduxStoreShape} from "./models/store";
import {TReduxActionWithPayload} from "./models/action";
import {authenticationStateReducer} from "../../authentication/redux/reducer/authenticationStateReducer";

function generateRootReducer() {
  return combineReducers<ReduxStoreShape, TReduxActionWithPayload>({
    authenticationState: authenticationStateReducer
  });
}

export default generateRootReducer;
