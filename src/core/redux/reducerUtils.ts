import {combineReducers} from "redux";

import {
  ReduxStoreShape,
  MinimalAsyncStoreState,
  TMinimalListState,
  TMinimalFormState
} from "./models/store";
import {TReduxActionWithPayload, AsyncActionTypes} from "./models/action";
import {authenticationStateReducer} from "../../authentication/redux/reducer/authenticationStateReducer";

function generateRootReducer() {
  return combineReducers<ReduxStoreShape, TReduxActionWithPayload>({
    authenticationState: authenticationStateReducer
  });
}

function reduxAsyncReducerFactory<T>(
  initialState: TMinimalFormState<T>,
  actionTypes: AsyncActionTypes,
  type: "form"
): (state: typeof initialState, action: TReduxActionWithPayload) => typeof initialState;
function reduxAsyncReducerFactory<T>(
  initialState: TMinimalListState<T>,
  actionTypes: AsyncActionTypes,
  type: "list"
): (state: typeof initialState, action: TReduxActionWithPayload) => typeof initialState;
function reduxAsyncReducerFactory<T>(
  initialState: MinimalAsyncStoreState<T>,
  actionTypes: AsyncActionTypes,
  type: "basic"
): (state: typeof initialState, action: TReduxActionWithPayload) => typeof initialState;
function reduxAsyncReducerFactory(
  initialState: any,
  actionTypes: AsyncActionTypes,
  type: "basic" | "list" | "form"
) {
  return (state = initialState, action: TReduxActionWithPayload): typeof initialState => {
    switch (action.type) {
      case actionTypes.REQUEST_TRIGGER: {
        let newState = {
          ...state,
          isRequestPending: true,
          isRequestFetched: false,
          data: null,
          errorInfo: null
        };

        if (type === "form") {
          newState = {
            ...newState,
            // @ts-ignore
            isPristine: true
          };
        }

        return newState;
      }

      case actionTypes.REQUEST_SUCCESS: {
        let newState = {
          isRequestPending: false,
          isRequestFetched: true,
          data: action.payload,
          errorInfo: null
        };

        if (type === "list") {
          const {results, ...rest} = action.payload || {results: []};

          newState = {
            ...state,
            ...rest,
            isRequestPending: false,
            isRequestFetched: true,
            data: results,
            errorInfo: null
          };
        } else if (type === "form") {
          newState = {
            ...state,
            // @ts-ignore
            isPristine: true
          };
        }

        return newState;
      }

      case actionTypes.REQUEST_ERROR: {
        return {
          isRequestPending: false,
          isRequestFetched: true,
          data: null,
          errorInfo: action.payload.data
        };
      }

      case actionTypes.REQUEST_CANCELLED: {
        return {
          isRequestPending: false,
          isRequestFetched: false,
          data: null,
          errorInfo: null
        };
      }

      default:
        return state;
    }
  };
}

export default generateRootReducer;
export {reduxAsyncReducerFactory};
