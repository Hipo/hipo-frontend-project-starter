import {Dispatch, AnyAction} from "redux";

import {ASYNC_ACTION_PHASE} from "../../reduxConstants";

function promisifyAsyncActionsMiddleware() {
  const promiseContextMap = new Map();

  return (next: Dispatch) => (action: AnyAction) => {
    let result;

    if (action.isAsync) {
      if (action.asyncPhase === ASYNC_ACTION_PHASE.TRIGGER) {
        next(action);

        const promiseContext: any = {};
        const promise = new Promise((resolve, reject) => {
          promiseContext.resolve = resolve;
          promiseContext.reject = reject;
        });

        promiseContext.promise = promise;
        promiseContextMap.set(action.typeBase, promiseContext);
        result = promise;
      } else {
        const promiseContext = promiseContextMap.get(action.typeBase);

        if (promiseContext) {
          if (action.asyncPhase === ASYNC_ACTION_PHASE.SUCCESS) {
            promiseContext.resolve(action.payload);
          } else if (action.asyncPhase === ASYNC_ACTION_PHASE.ERROR) {
            promiseContext.reject(action.payload);
          }

          promiseContextMap.delete(action.typeBase);
        }

        result = next(action);
      }
    } else {
      result = next(action);
    }

    return result;
  };
}

export default promisifyAsyncActionsMiddleware;
