import {Dispatch, AnyAction} from "redux";

import {ASYNC_ACTION_PHASE} from "../../reduxConstants";
import {ReduxAsyncAction} from "../../models/action";

function promisifyAsyncActionsMiddleware() {
  const promiseContextMap = new Map();

  return (next: Dispatch) => (action: AnyAction) => {
    let result;

    if (action.isAsync) {
      const asyncAction = action as ReduxAsyncAction;

      if (asyncAction.asyncPhase === ASYNC_ACTION_PHASE.TRIGGER) {
        next(asyncAction);

        const promiseContext: any = {};
        const promise = new Promise((resolve, reject) => {
          promiseContext.resolve = resolve;
          promiseContext.reject = reject;
        });

        promiseContext.promise = promise;
        promiseContext.triggerActionPayload = asyncAction.payload;
        promiseContextMap.set(asyncAction.typeBase, promiseContext);
        result = promise;
      } else {
        const promiseContext = promiseContextMap.get(asyncAction.typeBase);

        if (promiseContext) {
          if (asyncAction.asyncPhase === ASYNC_ACTION_PHASE.SUCCESS) {
            promiseContext.resolve(asyncAction.payload);
          } else if (asyncAction.asyncPhase === ASYNC_ACTION_PHASE.ERROR) {
            promiseContext.reject({
              errorDetail: asyncAction.payload,
              triggerActionPayload: promiseContext.triggerActionPayload
            });
          }

          promiseContextMap.delete(asyncAction.typeBase);
        }

        result = next(asyncAction);
      }
    } else {
      result = next(action);
    }

    return result;
  };
}

export default promisifyAsyncActionsMiddleware;
