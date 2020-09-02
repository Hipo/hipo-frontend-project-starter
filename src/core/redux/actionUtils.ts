import {
  AsyncActionTypes,
  AsyncActionCreators,
  PromisifiedTriggerActionCreator
} from "./models/action";
import {ASYNC_ACTION_PHASE} from "./reduxConstants";

function getReduxActionTypeName(base: string) {
  return (actionTitle: string) => `@@${base}/${actionTitle}`;
}

function getAsyncActionTypes(base: string): AsyncActionTypes {
  const actionTypeNameGenerator = getReduxActionTypeName(base);

  return {
    BASE: base,
    REQUEST_TRIGGER: actionTypeNameGenerator("REQUEST_TRIGGER"),
    REQUEST_SUCCESS: actionTypeNameGenerator("REQUEST_SUCCESS"),
    REQUEST_ERROR: actionTypeNameGenerator("REQUEST_ERROR"),
    REQUEST_CANCELLED: actionTypeNameGenerator("REQUEST_CANCELLED"),
    REQUEST_CLEANUP: actionTypeNameGenerator("REQUEST_CLEANUP")
  };
}

function getTriggerActionCreatorAsPromiseTyped<
  ActionCreators extends AsyncActionCreators<any, any, any>
>(actionCreators: ActionCreators) {
  return (actionCreators.trigger as unknown) as PromisifiedTriggerActionCreator<
  ActionCreators
  >;
}

function generateAsyncActionCreators<
  TriggerActionCreatorArgumentType,
  SuccessActionCreatorArgumentType,
  ErrorActionCreatorArgumentType
>(
  actionTypes: AsyncActionTypes
): AsyncActionCreators<
  TriggerActionCreatorArgumentType,
  SuccessActionCreatorArgumentType,
  ErrorActionCreatorArgumentType
> {
  return {
    trigger: (payload) => ({
      type: actionTypes.REQUEST_TRIGGER,
      typeBase: actionTypes.BASE,
      isAsync: true,
      asyncPhase: ASYNC_ACTION_PHASE.TRIGGER,
      payload
    }),
    success: (payload) => ({
      type: actionTypes.REQUEST_SUCCESS,
      typeBase: actionTypes.BASE,
      isAsync: true,
      asyncPhase: ASYNC_ACTION_PHASE.SUCCESS,
      payload
    }),
    error: (payload) => ({
      type: actionTypes.REQUEST_ERROR,
      typeBase: actionTypes.BASE,
      isAsync: true,
      asyncPhase: ASYNC_ACTION_PHASE.ERROR,
      payload: {
        data: payload
      }
    }),
    cancel: () => ({
      type: actionTypes.REQUEST_CANCELLED,
      typeBase: actionTypes.BASE,
      isAsync: true,
      asyncPhase: ASYNC_ACTION_PHASE.CANCELLED
    }),
    cleanup: () => ({
      type: actionTypes.REQUEST_CLEANUP,
      typeBase: actionTypes.BASE,
      isAsync: true,
      asyncPhase: ASYNC_ACTION_PHASE.CLEANUP
    })
  };
}

export {
  getReduxActionTypeName,
  getAsyncActionTypes,
  generateAsyncActionCreators,
  getTriggerActionCreatorAsPromiseTyped
};
