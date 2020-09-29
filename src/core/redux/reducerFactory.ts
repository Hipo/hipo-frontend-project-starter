import {MinimalAsyncStoreState} from "./models/store";
import {AsyncActionTypes, ReduxActionWithPayload} from "./models/action";
import {ApiErrorShape} from "../network-manager/networkModels";
import {createErrorWithApiErrorShapeFromString} from "../../utils/error/errorUtils";

function reduxAsyncReducerFactory<Data, ApiHandlerArgument>(
  initialState: MinimalAsyncStoreState<Data, ApiHandlerArgument>,
  actionTypes: AsyncActionTypes,
  _type: "basic"
) {
  return function asyncReducer(
    state = initialState,
    action: ReduxActionWithPayload
  ): typeof initialState {
    let newState;

    switch (action.type) {
      case actionTypes.REQUEST_TRIGGER: {
        newState = {
          ...state,
          isRequestPending: true,
          isRequestFetched: false
        };

        break;
      }

      case actionTypes.REQUEST_SUCCESS: {
        newState = {
          isRequestPending: false,
          isRequestFetched: true,
          data: action.payload,
          errorInfo: null
        };

        break;
      }

      case actionTypes.REQUEST_ERROR: {
        const {errorDetail, requestPayload} = action.payload;
        let finalErrorInfo: null | ApiErrorShape = null;

        if (errorDetail instanceof Error) {
          finalErrorInfo = createErrorWithApiErrorShapeFromString(
            errorDetail.message,
            "ReducerFactory"
          );
        } else if (errorDetail?.data) {
          finalErrorInfo = errorDetail.data;
        }

        newState = {
          isRequestPending: false,
          isRequestFetched: true,
          data: null,
          errorInfo: finalErrorInfo,
          requestPayload
        };

        break;
      }

      case actionTypes.REQUEST_CANCELLED: {
        newState = {
          isRequestPending: false,
          isRequestFetched: false,
          data: null,
          errorInfo: null
        };

        break;
      }

      default:
        newState = state;
    }

    return newState;
  };
}

export {reduxAsyncReducerFactory};
