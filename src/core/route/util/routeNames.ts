const ROOT_ROUTE = "/";

const ROUTE_NAMES = {
  ROOT: ROOT_ROUTE,
  COUNTER: `${ROOT_ROUTE}/counter`
} as const;

export default ROUTE_NAMES;
