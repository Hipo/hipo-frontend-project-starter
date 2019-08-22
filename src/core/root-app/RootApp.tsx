import {hot} from "react-hot-loader/root";
import React, {Suspense} from "react";
import {Router, Link} from "@reach/router";

import {isDevelopmentEnv} from "../../utils/globalVariables";
import getPublicRouteComponents from "../route/publicRoutes";
import getProtectedRouteComponents from "../route/protectedRoutes";
import NotFound from "../../components/NotFound";
import RouteLoading from "../../components/RouteLoading";

function RootApp() {
  return (
    <React.StrictMode>
      <nav>
        <Link to={"/"}>{"home"}</Link> <Link to={"counter"}>{"counter"}</Link>
      </nav>

      <Suspense fallback={<RouteLoading />}>
        <Router>
          <NotFound default={true} />
          {getPublicRouteComponents()}
          {getProtectedRouteComponents()}
        </Router>
      </Suspense>
    </React.StrictMode>
  );
}

const hotRootApp = isDevelopmentEnv() ? hot(RootApp) : RootApp;

export default hotRootApp;
