import {
  AsyncActionTypes,
  AsyncActionCreators,
  TPromisifiedTriggerActionCreator
} from "./models/action";
import {ASYNC_ACTION_PHASE} from "./reduxConstants";

function getAsyncActionTypes(base: string): AsyncActionTypes {
  return {
    BASE: base,
    REQUEST_TRIGGER: `@@${base}/REQUEST_TRIGGER`,
    REQUEST_SUCCESS: `@@${base}/REQUEST_SUCCESS`,
    REQUEST_ERROR: `@@${base}/REQUEST_ERROR`,
    REQUEST_CANCELLED: `@@${base}/REQUEST_CANCELLED`,
    REQUEST_CLEANUP: `@@${base}/REQUEST_CLEANUP`
  };
}

function getTriggerActionCreatorAsPromiseTyped<
  TActionCreators extends AsyncActionCreators<any, any, any>
>(actionCreators: TActionCreators) {
  return (actionCreators.trigger as unknown) as TPromisifiedTriggerActionCreator<
    TActionCreators
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
      payload
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
  getAsyncActionTypes,
  generateAsyncActionCreators,
  getTriggerActionCreatorAsPromiseTyped
};
