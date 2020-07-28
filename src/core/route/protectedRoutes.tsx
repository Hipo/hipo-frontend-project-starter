import React, {lazy} from "react";

import ROUTE_NAMES from "./util/routeNames";
import ProtectedRoute from "./component/ProtectedRoute";

// An example of lazy-loading. However, only lazy-load when necessary.
const Counter = lazy(() =>
  import(/* webpackChunkName: "counter" */ "../../components/counter/Counter")
);

function getProtectedRouteComponents() {
  return [
    <ProtectedRoute
      key={`route:=${ROUTE_NAMES.COUNTER}`}
      exact={true}
      path={ROUTE_NAMES.COUNTER}>
      <Counter />
    </ProtectedRoute>
  ];
}

export default getProtectedRouteComponents;
