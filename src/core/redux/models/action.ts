import {Action} from "redux";

import {ValueOf} from "../../../utils/typeUtils";
import {ASYNC_ACTION_PHASE} from "../reduxConstants";

type ReduxActionWithPayload<T = any> = Action<string> & {
  payload: T;
};

type ReduxAsyncAction<T = any> = ReduxActionWithPayload<T> & {
  typeBase: string;
  isAsync: boolean;
  asyncPhase: ValueOf<typeof ASYNC_ACTION_PHASE>;
};

type ReduxActionCreator<ArgumentType, P = any> = (
  x: ArgumentType
) => ReduxActionWithPayload<P>;

type ReduxAsyncActionCreator<ArgumentType, P = any> = (
  x: ArgumentType
) => ReduxAsyncAction<P>;

type ReduxActionCreatorWithoutArgument = () => Action<string>;

interface AsyncActionCreators<
  TriggerActionCreatorArgumentType,
  SuccessActionCreatorArgumentType,
  ErrorActionCreatorArgumentType
> {
  trigger: ReduxAsyncActionCreator<TriggerActionCreatorArgumentType>;
  success: ReduxAsyncActionCreator<SuccessActionCreatorArgumentType>;
  error: ReduxAsyncActionCreator<ErrorActionCreatorArgumentType>;
  cancel: ReduxActionCreatorWithoutArgument;
  cleanup: ReduxActionCreatorWithoutArgument;
}

type PromisifiedTriggerActionCreator<
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
  ReduxAsyncAction,
  ReduxActionWithPayload,
  ReduxActionCreator,
  AsyncActionTypes,
  AsyncActionCreators,
  ReduxActionCreatorWithoutArgument,
  PromisifiedTriggerActionCreator
};
