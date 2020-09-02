import {ApiHandlerCreator} from "../network-manager/apiHandler";
import {MinimalAsyncStoreState} from "./models/store";
import {
  AsyncActionTypes,
  AsyncActionCreators,
  PromisifiedTriggerActionCreator,
  ReduxActionWithPayload
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

function asyncReduxAutomator<ApiHandlerArgument, Data>(
  baseActionName: string,
  apiHandler: ApiHandlerCreator<ApiHandlerArgument>,
  initialState: MinimalAsyncStoreState<Data>,
  type: "basic"
): {
  initialState: MinimalAsyncStoreState<Data>;
  actionTypes: AsyncActionTypes;
  actionCreators: Pick<
    AsyncActionCreators<ApiHandlerArgument, Data, ApiErrorShape>,
    "cancel" | "error" | "success" | "cleanup"
  > & {
    trigger: PromisifiedTriggerActionCreator<
      AsyncActionCreators<ApiHandlerArgument, Data, ApiErrorShape>
    >;
  };
  saga: ReturnType<typeof sagaWatcherFactory>["saga"];
  watcher: ReturnType<typeof sagaWatcherFactory>["watcher"];
  reducer: (
    state: MinimalAsyncStoreState<Data> | undefined,
    action: ReduxActionWithPayload<any>
  ) => MinimalAsyncStoreState<Data>;
};

function asyncReduxAutomator<ApiHandlerArgument, Data>(
  baseActionName: string,
  apiHandler: ApiHandlerCreator<ApiHandlerArgument>,
  initialState: MinimalAsyncStoreState<Data>,
  type: "poll",
  pollingOptions: PollingSagaOptions
): {
  initialState: MinimalAsyncStoreState<Data>;
  actionTypes: AsyncActionTypes;
  actionCreators: Pick<
    AsyncActionCreators<
      ApiHandlerArgument & {"@@frontendPollingInterval": number},
      Data,
      ApiErrorShape
    >,
    "cancel" | "error" | "success" | "cleanup"
  > & {
    trigger: PromisifiedTriggerActionCreator<
      AsyncActionCreators<ApiHandlerArgument, Data, ApiErrorShape>
    >;
  };
  saga: ReturnType<typeof pollingSagaWatcherFactory>["saga"];
  watcher: ReturnType<typeof pollingSagaWatcherFactory>["watcher"];
  reducer: (
    state: MinimalAsyncStoreState<Data> | undefined,
    action: ReduxActionWithPayload<any>
  ) => MinimalAsyncStoreState<Data>;
};

function asyncReduxAutomator<ApiHandlerArgument, Data>(
  baseActionName: string,
  apiHandler: ApiHandlerCreator<ApiHandlerArgument>,
  initialState: any,
  type: "basic" | "poll",
  pollingOptions?: PollingSagaOptions
) {
  const actionTypes = getAsyncActionTypes(baseActionName);
  const actionCreators = generateAsyncActionCreators<
    ApiHandlerArgument,
    Data,
    ApiErrorShape
  >(actionTypes);
  const sagaAndWatcher =
    type === "poll"
      ? pollingSagaWatcherFactory<ApiHandlerArgument>(
          apiHandler,
          actionTypes,
          pollingOptions!
        )
      : sagaWatcherFactory<ApiHandlerArgument>(apiHandler, actionTypes);
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
