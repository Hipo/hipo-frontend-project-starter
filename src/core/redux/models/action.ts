import {Action} from "redux";

import {ValueOf} from "../../../utils/typeUtils";
import {ASYNC_ACTION_PHASE} from "../reduxConstants";

type TReduxActionWithPayload<T = any> = Action<string> & {
  payload: T;
};

type TReduxAsyncAction<T = any> = TReduxActionWithPayload<T> & {
  typeBase: string;
  isAsync: boolean;
  asyncPhase: ValueOf<typeof ASYNC_ACTION_PHASE>;
};

type TReduxActionCreator<ArgumentType, P = any> = (
  x: ArgumentType
) => TReduxActionWithPayload<P>;

type TReduxAsyncActionCreator<ArgumentType, P = any> = (
  x: ArgumentType
) => TReduxAsyncAction<P>;

type TReduxActionCreatorWithoutArgument = () => Action<string>;

interface AsyncActionCreators<
  TriggerActionCreatorArgumentType,
  SuccessActionCreatorArgumentType,
  ErrorActionCreatorArgumentType
> {
  trigger: TReduxAsyncActionCreator<TriggerActionCreatorArgumentType>;
  success: TReduxAsyncActionCreator<SuccessActionCreatorArgumentType>;
  error: TReduxAsyncActionCreator<ErrorActionCreatorArgumentType>;
  cancel: TReduxActionCreatorWithoutArgument;
  cleanup: TReduxActionCreatorWithoutArgument;
}

type TPromisifiedTriggerActionCreator<
  TActionCreators extends AsyncActionCreators<any, any, any>
> = (
  ...args: Parameters<TActionCreators["trigger"]>
) => Promise<Parameters<TActionCreators["success"]>[0]>;

interface AsyncActionTypes {
  BASE: string;
  REQUEST_TRIGGER: string;
  REQUEST_SUCCESS: string;
  REQUEST_ERROR: string;
  REQUEST_CANCELLED: string;
  REQUEST_CLEANUP: string;
}

export {
  TReduxAsyncAction,
  TReduxActionWithPayload,
  TReduxActionCreator,
  AsyncActionTypes,
  AsyncActionCreators,
  TReduxActionCreatorWithoutArgument,
  TPromisifiedTriggerActionCreator
};
