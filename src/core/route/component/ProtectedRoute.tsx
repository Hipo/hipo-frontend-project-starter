import React from "react";
import {RouteComponentProps} from "@reach/router";
import {useSelector} from "react-redux";

import {authenticationProfileSelector} from "../../../authentication/redux/util/authenticationReduxUtils";
import UnreachableProtectedRouteMessage from "./UnreachableProtectedRouteMessage";

interface ProtectedRouteOwnProps {
  component: React.ComponentType<RouteComponentProps>;
}

type TProtectedRouteProps = ProtectedRouteOwnProps & RouteComponentProps;

function ProtectedRoute({component: PageComponent, ...rest}: TProtectedRouteProps) {
  const authProfile = useSelector(authenticationProfileSelector);

  if (authProfile) {
    return <PageComponent {...rest} />;
  }

  return <UnreachableProtectedRouteMessage />;
}

export default ProtectedRoute;
