import {TApiHandlerCreator} from "../network-manager/apiHandler";
import {
  TMinimalListState,
  TMinimalFormState,
  MinimalAsyncStoreState
} from "./models/store";
import {
  AsyncActionTypes,
  AsyncActionCreators,
  TPromisifiedTriggerActionCreator,
  TReduxActionWithPayload
} from "./models/action";
import {ApiListResponse, ApiErrorShape} from "../network-manager/networkModels";
import {sagaWatcherFactory, pollingSagaWatcherFactory} from "./sagaUtils";
import {
  getAsyncActionTypes,
  generateAsyncActionCreators,
  getTriggerActionCreatorAsPromiseTyped
} from "./actionUtils";
import {reduxAsyncReducerFactory} from "./reducerUtils";

function asyncReduxAutomator<TApiHandlerArgument, TData>(
  baseActionName: string,
  apiHandler: TApiHandlerCreator<TApiHandlerArgument>,
  initialState: TMinimalListState<TData>,
  type: "list"
): {
  actionTypes: AsyncActionTypes;
  actionCreators: Pick<
    AsyncActionCreators<TApiHandlerArgument, ApiListResponse<TData>, ApiErrorShape>,
    "cancel" | "error" | "success" | "cleanup"
  > & {
    trigger: TPromisifiedTriggerActionCreator<
      AsyncActionCreators<TApiHandlerArgument, ApiListResponse<TData>, ApiErrorShape>
    >;
  };
  saga: ReturnType<typeof sagaWatcherFactory>["saga"];
  watcher: ReturnType<typeof sagaWatcherFactory>["watcher"];
  reducer: (
    state: TMinimalListState<TData> | undefined,
    action: TReduxActionWithPayload<any>
  ) => TMinimalListState<TData>;
};

function asyncReduxAutomator<TApiHandlerArgument, TData>(
  baseActionName: string,
  apiHandler: TApiHandlerCreator<TApiHandlerArgument>,
  initialState: TMinimalFormState<TData>,
  type: "form"
): {
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
    state: TMinimalFormState<TData> | undefined,
    action: TReduxActionWithPayload<any>
  ) => TMinimalFormState<TData>;
};

function asyncReduxAutomator<TApiHandlerArgument, TData>(
  baseActionName: string,
  apiHandler: TApiHandlerCreator<TApiHandlerArgument>,
  initialState: MinimalAsyncStoreState<TData>,
  type: "basic"
): {
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
  type: "poll"
): {
  actionTypes: AsyncActionTypes;
  actionCreators: Pick<
    AsyncActionCreators<TApiHandlerArgument, TData, ApiErrorShape>,
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
  type: "list" | "form" | "basic" | "poll"
) {
  const actionTypes = getAsyncActionTypes(baseActionName);
  const actionCreators = generateAsyncActionCreators<
    TApiHandlerArgument,
    TData,
    ApiErrorShape
  >(actionTypes);
  const sagaAndWatcher =
    type === "poll"
      ? pollingSagaWatcherFactory<TApiHandlerArgument>(apiHandler, actionTypes)
      : sagaWatcherFactory<TApiHandlerArgument>(apiHandler, actionTypes);
  let reducer;

  if (type === "list") {
    const initialListState = initialState as TMinimalListState<TData>;

    reducer = reduxAsyncReducerFactory(initialListState, actionTypes, "list");
  } else if (type === "form") {
    const initialFormState = initialState as TMinimalFormState<TData>;

    reducer = reduxAsyncReducerFactory(initialFormState, actionTypes, "form");
  } else {
    const initialBasicAsyncState = initialState as MinimalAsyncStoreState<TData>;

    reducer = reduxAsyncReducerFactory(initialBasicAsyncState, actionTypes, "basic");
  }

  return {
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

export default asyncReduxAutomator;
