import {TApiHandlerCreator} from "../network-manager/apiHandler";
import {MinimalAsyncStoreState} from "./models/store";
import {
  AsyncActionTypes,
  AsyncActionCreators,
  TPromisifiedTriggerActionCreator,
  TReduxActionWithPayload
} from "./models/action";
import {ApiErrorShape} from "../network-manager/networkModels";
import {sagaWatcherFactory, pollingSagaWatcherFactory} from "./sagaUtils";
import {
  getAsyncActionTypes,
  generateAsyncActionCreators,
  getTriggerActionCreatorAsPromiseTyped
} from "./actionUtils";
import {reduxAsyncReducerFactory} from "./reducerFactory";
import {PollingSagaOptions} from "./models/saga";

function asyncReduxAutomator<TApiHandlerArgument, TData>(
  baseActionName: string,
  apiHandler: TApiHandlerCreator<TApiHandlerArgument>,
  initialState: MinimalAsyncStoreState<TData>,
  type: "basic"
): {
  initialState: MinimalAsyncStoreState<TData>;
  actionTypes: AsyncActionTypes;
  actionCreators: Pick<
    AsyncActionCreators<TApiHandlerArgument, TData, ApiErrorShape>,
    "cancel" | "error" | "success" | "cleanup"
  > & {
    trigger: TPromisifiedTriggerActionCreator<
      AsyncActionCreators<TApiHandlerArgument, TData, ApiErrorShape>
    >;
  };
  saga: ReturnType<typeof sagaWatcherFactory>["saga"];
  watcher: ReturnType<typeof sagaWatcherFactory>["watcher"];
  reducer: (
    state: MinimalAsyncStoreState<TData> | undefined,
    action: TReduxActionWithPayload<any>
  ) => MinimalAsyncStoreState<TData>;
};

function asyncReduxAutomator<TApiHandlerArgument, TData>(
  baseActionName: string,
  apiHandler: TApiHandlerCreator<TApiHandlerArgument>,
  initialState: MinimalAsyncStoreState<TData>,
  type: "poll",
  pollingOptions: PollingSagaOptions
): {
  initialState: MinimalAsyncStoreState<TData>;
  actionTypes: AsyncActionTypes;
  actionCreators: Pick<
    AsyncActionCreators<
      TApiHandlerArgument & {"@@frontendPollingInterval": number},
      TData,
      ApiErrorShape
    >,
    "cancel" | "error" | "success" | "cleanup"
  > & {
    trigger: TPromisifiedTriggerActionCreator<
      AsyncActionCreators<TApiHandlerArgument, TData, ApiErrorShape>
    >;
  };
  saga: ReturnType<typeof pollingSagaWatcherFactory>["saga"];
  watcher: ReturnType<typeof pollingSagaWatcherFactory>["watcher"];
  reducer: (
    state: MinimalAsyncStoreState<TData> | undefined,
    action: TReduxActionWithPayload<any>
  ) => MinimalAsyncStoreState<TData>;
};

function asyncReduxAutomator<TApiHandlerArgument, TData>(
  baseActionName: string,
  apiHandler: TApiHandlerCreator<TApiHandlerArgument>,
  initialState: any,
  type: "basic" | "poll",
  pollingOptions?: PollingSagaOptions
) {
  const actionTypes = getAsyncActionTypes(baseActionName);
  const actionCreators = generateAsyncActionCreators<
    TApiHandlerArgument,
    TData,
    ApiErrorShape
  >(actionTypes);
  const sagaAndWatcher =
    type === "poll"
      ? pollingSagaWatcherFactory<TApiHandlerArgument>(
          apiHandler,
          actionTypes,
          pollingOptions!
        )
      : sagaWatcherFactory<TApiHandlerArgument>(apiHandler, actionTypes);
  const reducer = reduxAsyncReducerFactory(initialState, actionTypes, "basic");

  return {
    initialState,
    actionTypes,
    actionCreators: {
      ...actionCreators,
      trigger: getTriggerActionCreatorAsPromiseTyped(actionCreators)
    },
    saga: sagaAndWatcher.saga,
    watcher: sagaAndWatcher.watcher,
    reducer
  };
}

export {asyncReduxAutomator};
