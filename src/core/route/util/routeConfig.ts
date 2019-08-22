import ROUTE_NAMES from "./routeNames";
import {HomeOwnProps} from "../../../home/Home";

interface RouteConfig {
  [ROUTE_NAMES.ROOT]: {
    props: HomeOwnProps;
    [x: string]: any;
  };
}

const ROUTE_CONFIG: RouteConfig = {
  [ROUTE_NAMES.ROOT]: {
    props: {
      name: "Project homepage"
    }
  }
};

export default ROUTE_CONFIG;
