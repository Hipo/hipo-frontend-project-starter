/*
As of Babel 7.4.0, @babel/polyfill package has been deprecated in favor of directly including 
- core-js/stable (to polyfill ECMAScript features)
- regenerator-runtime/runtime (needed to use transpiled generator functions):
*/
import "core-js/stable";
import "regenerator-runtime/runtime";

import React from "react";
import ReactDOM from "react-dom";
import {Provider} from "react-redux";
import Axios from "axios";

import RootApp from "./core/root-app/RootApp";
import NetworkManager from "./core/network-manager/NetworkManager";
import authenticationManager from "./core/authenticationManager";
import {createReduxStore} from "./core/redux/storeUtils";
import {ReduxStoreShape} from "./core/redux/models/store";
import {UserProfileModel} from "./authentication/model/authenticationEndpointModels";

// initSentry();
const networkManager = new NetworkManager({
  headers: {
    common: {
      Authentication: authenticationManager.getToken()
    }
  }
});

// This initial authenticated profile check request should not include the interceptors provided to axios instance used in `NetworkManager`.
Axios.get("/profiles/me/", {
  baseURL: API_BASE_URL
})
  .then((response) => {
    const profileData = response.data as UserProfileModel;

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
