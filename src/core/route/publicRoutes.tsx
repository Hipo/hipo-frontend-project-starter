import React from "react";

import ROUTE_NAMES from "./util/routeNames";
import ROUTE_CONFIG from "./util/routeConfig";
import Home from "../../home/Home";

function getPublicRouteComponents() {
  return [
    <Home
      key={`route:=${ROUTE_NAMES.ROOT}`}
      path={ROUTE_NAMES.ROOT}
      {...ROUTE_CONFIG[ROUTE_NAMES.ROOT].props}
    />
  ];
}

export default getPublicRouteComponents;
