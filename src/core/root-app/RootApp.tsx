import "../ui/style/_overrides.scss";

import {hot} from "react-hot-loader/root";
import React, {Suspense} from "react";
import {BrowserRouter, Route, Link, Switch} from "react-router-dom";

import {isDevelopmentEnv} from "../../utils/globalVariables";
import getPublicRouteComponents from "../route/publicRoutes";
import getProtectedRouteComponents from "../route/protectedRoutes";
import {getPublicFallbackRoutes} from "../route/fallbackRoutes";
import RouteLoading from "../route/component/loading/RouteLoading";
import ErrorBoundary from "../error/ErrorBoundary";

function RootApp() {
  return (
    <BrowserRouter basename={"/"}>
      <Route path={"/"} component={AppWithErrorBoundary} />
    </BrowserRouter>
  );
}

function AppWithErrorBoundary() {
  return (
    <React.StrictMode>
      <Suspense fallback={<RouteLoading />}>
        <nav>
          <Link to={"/"}>{"home"}</Link> <Link to={"counter"}>{"counter"}</Link>
        </nav>

        <ErrorBoundary>
          <Switch>
            {[
              ...getPublicRouteComponents(),
              ...getProtectedRouteComponents(),
              ...getPublicFallbackRoutes()
            ]}
          </Switch>
        </ErrorBoundary>
      </Suspense>
    </React.StrictMode>
  );
}

const hotRootApp = isDevelopmentEnv() ? hot(RootApp) : RootApp;

export default hotRootApp;
