import React from "react";
import {Link} from "@reach/router";

function UnreachableProtectedRouteMessage() {
  return (
    <div>
      <p>{"You need to login to reach this page."}</p>
      <Link to={"/login"}>{"Login"}</Link>
    </div>
  );
}

export default UnreachableProtectedRouteMessage;
