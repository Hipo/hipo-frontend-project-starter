import {combineReducers} from "redux";

import {ReduxStoreShape} from "./models/store";
import {ReduxActionWithPayload} from "./models/action";
import authenticationStateReducer from "../../authentication/redux/reducer/authenticationStateReducer";

function generateRootReducer() {
  return combineReducers<ReduxStoreShape, ReduxActionWithPayload>({
    authenticationState: authenticationStateReducer
  });
}

export default generateRootReducer;
