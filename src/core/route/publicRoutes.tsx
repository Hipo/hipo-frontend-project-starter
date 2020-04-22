import React from "react";
import {Route} from "react-router-dom";

import ROUTE_NAMES from "./util/routeNames";
import ROUTE_CONFIG from "./util/routeConfig";
import Home from "../../home/Home";

function getPublicRouteComponents() {
  return [
    <Route key={`route:=${ROUTE_NAMES.ROOT}`} exact={true} path={ROUTE_NAMES.ROOT}>
      <Home {...ROUTE_CONFIG[ROUTE_NAMES.ROOT].props} />
    </Route>
  ];
}

export default getPublicRouteComponents;
