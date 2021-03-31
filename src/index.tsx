/*
As of Babel 7.4.0, @babel/polyfill package has been deprecated in favor of directly including 
- core-js/stable (to polyfill ECMAScript features)
- regenerator-runtime/runtime (needed to use transpiled generator functions):
*/
import "core-js/stable";
import "regenerator-runtime/runtime";

import "./core/ui/style/reference/_color.scss";
import "./core/ui/style/reference/_measure.scss";

import React from "react";
import ReactDOM from "react-dom";
import {Provider} from "react-redux";

import RootApp from "./core/root-app/RootApp";
import NetworkManager from "./core/network-manager/NetworkManager";
import authenticationManager from "./authentication/util/authenticationManager";
import {createReduxStore} from "./core/redux/storeUtils";
import {ReduxStoreShape} from "./core/redux/models/store";
import authenticationApi from "./authentication/api/authenticationApi";
import {generateAuthorizationHeaderValue} from "./core/network-manager/networkUtils";

// initSentry();
const networkManager = new NetworkManager({
  headers: {
    common: {
      Authorization: generateAuthorizationHeaderValue(authenticationManager.getToken())
    }
  }
});

authenticationApi
  .getAuthUser()
  .then((response) => {
    const profileData = response.data;

    // setUserContextForSentry(profileData);
    bootstrapApp({
      authenticationState: {
        authenticatedProfile: profileData
      }
    });
  })
  .catch(() => {
    bootstrapApp({});
  });

function bootstrapApp(initialStoreState: Partial<ReduxStoreShape> = {}) {
  const reduxStore = createReduxStore(initialStoreState);

  ReactDOM.render(
    <Provider store={reduxStore}>
      <RootApp />
    </Provider>,
    document.getElementById("root")
  );
}

export {networkManager};
