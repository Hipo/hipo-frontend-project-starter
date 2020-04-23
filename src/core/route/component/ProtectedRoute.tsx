import React from "react";
import {useSelector} from "react-redux";
import {RouteProps, Route, Redirect, useLocation} from "react-router-dom";

import ROUTE_NAMES from "../util/routeNames";
import {authenticationProfileSelector} from "../../../authentication/redux/util/authenticationReduxUtils";
import {generateRedirectStateFromLocation} from "../util/routeUtils";

function ProtectedRoute(routeProps: RouteProps) {
  const authProfile = useSelector(authenticationProfileSelector);
  const location = useLocation();

  if (authProfile) {
    return <Route {...routeProps} />;
  }

  return (
    <Redirect
      to={{
        pathname: ROUTE_NAMES.ROOT,
        state: generateRedirectStateFromLocation(location)
      }}
    />
  );
}

export default ProtectedRoute;
