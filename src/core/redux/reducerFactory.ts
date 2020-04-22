import {MinimalAsyncStoreState} from "./models/store";
import {AsyncActionTypes, TReduxActionWithPayload} from "./models/action";
import {ApiErrorShape} from "../network-manager/networkModels";

function reduxAsyncReducerFactory<T>(
  initialState: MinimalAsyncStoreState<T>,
  actionTypes: AsyncActionTypes,
  // @ts-ignore
  type: "basic"
) {
  return (state = initialState, action: TReduxActionWithPayload): typeof initialState => {
    switch (action.type) {
      case actionTypes.REQUEST_TRIGGER: {
        return {
          ...state,
          isRequestPending: true,
          isRequestFetched: false
        };
      }

      case actionTypes.REQUEST_SUCCESS: {
        return {
          isRequestPending: false,
          isRequestFetched: true,
          data: action.payload,
          errorInfo: null
        };
      }

      case actionTypes.REQUEST_ERROR: {
        let finalErrorInfo: null | ApiErrorShape = null;

        if (action.payload instanceof Error) {
          finalErrorInfo = {
            type: "ReducerFactory",
            detail: {
              non_field_errors: [action.payload.message]
            },
            fallback_message: action.payload.message
          };
        } else if (action.payload && action.payload.data) {
          finalErrorInfo = action.payload.data;
        }

        return {
          isRequestPending: false,
          isRequestFetched: true,
          data: null,
          errorInfo: finalErrorInfo
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

export {reduxAsyncReducerFactory};
