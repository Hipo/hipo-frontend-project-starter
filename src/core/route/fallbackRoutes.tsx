import React from "react";
import {Route} from "react-router-dom";

import NotFoundPage from "./component/not-found/NotFoundPage";

function getPublicFallbackRoutes() {
  return [<Route key={"*"} path={"*"} component={NotFoundPage} />];
}

export {getPublicFallbackRoutes};
