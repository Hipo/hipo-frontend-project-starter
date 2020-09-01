import {
  all,
  call,
  put,
  cancelled,
  take,
  fork,
  cancel,
  race,
  delay
} from "redux-saga/effects";
import {AxiosPromise} from "axios";

import {TApiHandlerCreator} from "../network-manager/apiHandler";
import {AsyncActionTypes} from "./models/action";
import {TAsyncSaga, TAsyncSagaFactoryFunc, PollingSagaOptions} from "./models/saga";
import {ASYNC_ACTION_PHASE} from "./reduxConstants";
import {POLLING_INTERVAL} from "../network-manager/networkConstants";

function generateRootSaga() {
  function* rootSaga() {
    yield all([]);
  }

  return rootSaga;
}

function sagaWatcherFactory<T>(
  apiHandler: TApiHandlerCreator<T>,
  actionTypes: AsyncActionTypes
) {
  const saga = (arg: T) => generateBasicAsyncSaga<T>(apiHandler, actionTypes, arg);

  return {
    saga,
    watcher: generateDefaultAsyncWatcher(actionTypes, saga)
  };
}

function pollingSagaWatcherFactory<T>(
  apiHandler: TApiHandlerCreator<T>,
  actionTypes: AsyncActionTypes,
  pollingOptions: PollingSagaOptions
) {
  const saga = (arg: T) =>
    generatePollingSaga<T>(apiHandler, actionTypes, arg, pollingOptions);

  return {
    saga,
    watcher: generatePollingWatcher(actionTypes, saga)
  };
}

function generateBasicAsyncSaga<TApiHandlerArgumentShape = any>(
  apiHandler: (apiHandlerArgument: TApiHandlerArgumentShape) => AxiosPromise<any>,
  actionTypes: AsyncActionTypes,
  payload: TApiHandlerArgumentShape
): TAsyncSaga {
  return (function* basicSaga() {
    const putEffectAction = {
      typeBase: actionTypes.BASE,
      isAsync: true,
      payload: {}
    };

    try {
      const response = yield call(apiHandler, payload);

      yield put({
        ...putEffectAction,
        type: actionTypes.REQUEST_SUCCESS,
        payload: response.data,
        asyncPhase: ASYNC_ACTION_PHASE.SUCCESS
      });
    } catch (error) {
      yield put({
        ...putEffectAction,
        type: actionTypes.REQUEST_ERROR,
        payload: error,
        asyncPhase: ASYNC_ACTION_PHASE.ERROR
      });
    } finally {
      if (yield cancelled()) {
        yield put({
          ...putEffectAction,
          type: actionTypes.REQUEST_CLEANUP,
          asyncPhase: ASYNC_ACTION_PHASE.CLEANUP
        });
      }
    }
  })();
}

function generateTokenAuthSaga<
  TriggerActionArgument extends {requestPayload: any; rememberMe: boolean}
>(
  apiHandler: (
    apiHandlerArgument: TriggerActionArgument["requestPayload"]
  ) => AxiosPromise<any>,
  actionTypes: AsyncActionTypes,
  payload: TriggerActionArgument
): TAsyncSaga {
  return (function* basicSaga() {
    const putEffectAction = {
      typeBase: actionTypes.BASE,
      isAsync: true,
      payload: {}
    };

    try {
      const response = yield call(apiHandler, payload.requestPayload);

      // setAuthenticationTokenAndSentryUser(response.data, payload.rememberMe);

      yield put({
        ...putEffectAction,
        type: actionTypes.REQUEST_SUCCESS,
        payload: response.data,
        asyncPhase: ASYNC_ACTION_PHASE.SUCCESS
      });
    } catch (error) {
      yield put({
        ...putEffectAction,
        type: actionTypes.REQUEST_ERROR,
        payload: error,
        asyncPhase: ASYNC_ACTION_PHASE.ERROR
      });
    } finally {
      if (yield cancelled()) {
        yield put({
          ...putEffectAction,
          type: actionTypes.REQUEST_CLEANUP,
          asyncPhase: ASYNC_ACTION_PHASE.CLEANUP
        });
      }
    }
  })();
}

function generatePollingSaga<TApiHandlerArgumentShape = any>(
  apiHandler: (apiHandlerArgument: TApiHandlerArgumentShape) => AxiosPromise<any>,
  actionTypes: AsyncActionTypes,
  payload: TApiHandlerArgumentShape & {"@@frontendPollingInterval"?: number},
  options: PollingSagaOptions
): TAsyncSaga {
  let {interval = POLLING_INTERVAL} = options;
  const POLLING_REQUEST_TRIAL_LIMIT = 20;
  const intervalFromPassedPayload = payload && payload["@@frontendPollingInterval"];

  if (typeof intervalFromPassedPayload === "number") {
    delete payload["@@frontendPollingInterval"];
    interval = intervalFromPassedPayload;
  }

  return (function* pollingSaga() {
    const putEffectAction = {
      typeBase: actionTypes.BASE,
      isAsync: true,
      payload: {}
    };
    let trialCount = 0;

    while (true) {
      try {
        trialCount += 1;
        const response = yield call(apiHandler, payload);

        yield put({
          ...putEffectAction,
          type: actionTypes.REQUEST_SUCCESS,
          payload: response.data,
          asyncPhase: ASYNC_ACTION_PHASE.SUCCESS
        });

        trialCount = 0;
        yield delay(interval);
      } catch (error) {
        yield put({
          ...putEffectAction,
          type: actionTypes.REQUEST_ERROR,
          payload: error,
          asyncPhase: ASYNC_ACTION_PHASE.ERROR
        });

        if (trialCount > POLLING_REQUEST_TRIAL_LIMIT) {
          return;
        }

        yield delay(interval);
      } finally {
        if (yield cancelled()) {
          yield put({
            ...putEffectAction,
            type: actionTypes.REQUEST_CLEANUP,
            asyncPhase: ASYNC_ACTION_PHASE.CLEANUP
          });
        }
      }
    }
  })();
}

function generateDefaultAsyncWatcher(
  actionType: AsyncActionTypes,
  asyncSaga: TAsyncSagaFactoryFunc
) {
  return function* defaultAsyncWatcher() {
    /**
     *  Explanation of the functionality of `defaultAsyncWatcher`:
     *  First, it listens for a trigger action and then creates a task by forking out a saga that makes a request
     *  Let's say you throw a `@@partList/REQUEST_TRIGGER` action.
     *
     *  After it creates a task for this request, it keeps listening for:
     *  [
     *        `@@partList/REQUEST_TRIGGER`,
     *        `@@partList/REQUEST_SUCCESS`,
     *        `@@partList/REQUEST_ERROR`,
     *        `@@partList/REQUEST_CANCELLED`
     *  ].
     *  IMPORTANT:
     *      We don't listen for subsequent `@@partList/REQUEST_CLEANUP` actions!!
     *      This is important because that `REQUEST_CLEANUP` action is fired inside sagas on the finally block if Saga (task) was cancelled.
     *
     *  If it catches another `@@partList/REQUEST_TRIGGER` action again while previous task is still running,
     *  it cancels the previous task and creates a new task by forking a saga that makes that new request.
     */
    while (true) {
      /*
       * `latestTask` is first set after a request trigger action is catched,
       * Any preceding trigger actions after that should cancel this `latestTask`
       * and then generate the new task with that new trigger action
       */
      let latestTask: any;

      {
        // Listen for a request trigger action
        const firstAction = yield take(actionType.REQUEST_TRIGGER);

        latestTask = yield fork(asyncSaga, firstAction.payload);
      }

      while (true) {
        /*  Listen request trigger, success, error or cancelled actions
         *  (that has the same action type base as the first action)
         */
        const precedingAction = yield take([
          actionType.REQUEST_TRIGGER,
          actionType.REQUEST_SUCCESS,
          actionType.REQUEST_ERROR,
          actionType.REQUEST_CANCELLED
        ]);

        if (precedingAction.type === actionType.REQUEST_TRIGGER) {
          yield cancel(latestTask);
          latestTask = yield fork(asyncSaga, precedingAction.payload);

          /* eslint-disable no-continue */
          // go back to listening for trigger, success, error or cancelled actions
          continue;
          /* eslint-enable no-continue */
        } else if (precedingAction.type === actionType.REQUEST_CANCELLED) {
          yield cancel(latestTask);
        }

        // if we ever reach this point, break out of listening for all trigger, success, error or cancelled actions
        break;
      }
    }
  };
}

function generatePollingWatcher(
  actionType: AsyncActionTypes,
  pollingSaga: TAsyncSagaFactoryFunc
) {
  return function* () {
    while (true) {
      const triggerAction = yield take(actionType.REQUEST_TRIGGER);

      yield race([
        call(pollingSaga, triggerAction.payload),
        take(actionType.REQUEST_CANCELLED)
      ]);
    }
  };
}

export default generateRootSaga;
export {
  sagaWatcherFactory,
  pollingSagaWatcherFactory,
  generateTokenAuthSaga,
  generateDefaultAsyncWatcher
};
