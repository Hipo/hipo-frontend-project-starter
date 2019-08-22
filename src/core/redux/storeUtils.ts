import {createStore, applyMiddleware, compose} from "redux";
import createSagaMiddleware from "redux-saga";

import generateRootReducer from "./reducerUtils";
import generateRootSaga from "./sagaUtils";
import {ReduxStoreShape} from "./models/store";
import {isProduction} from "../../utils/globalVariables";
import {TReduxActionWithPayload} from "./models/action";
import promisifyAsyncActionsMiddleware from "./middleware/promisify-async-actions/promisifyAsyncActionsMiddleware";
import {generateInitialAuthenticationState} from "../../authentication/redux/authenticationState";

/* eslint-disable no-underscore-dangle */
const reduxDevToolsCompose = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
/* eslint-enable no-underscore-dangle */

function createReduxStore(customInitialState: Partial<ReduxStoreShape> = {}) {
  const rootReducer = generateRootReducer();
  const rootSaga = generateRootSaga();
  const sagaMiddleware = createSagaMiddleware();
  const notProdEnv = !isProduction();

  const composeEnhancers =
    notProdEnv && reduxDevToolsCompose
      ? reduxDevToolsCompose({
          trace: true,
          traceLimit: 25
        })
      : compose;

  const reduxStore = createStore<ReduxStoreShape, TReduxActionWithPayload, {}, {}>(
    rootReducer,
    generateInitialReduxStoreState(customInitialState),
    composeEnhancers(applyMiddleware(sagaMiddleware, promisifyAsyncActionsMiddleware))
  );

  sagaMiddleware.run(rootSaga);

  return reduxStore;
}

function generateInitialReduxStoreState(
  customInitialState: Partial<ReduxStoreShape> = {}
) {
  const initialState: ReduxStoreShape = {
    authenticationState: {
      ...generateInitialAuthenticationState(),
      ...customInitialState.authenticationState
    }
  };

  return initialState;
}

export {createReduxStore};
