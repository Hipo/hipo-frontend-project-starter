const ROOT_ROUTE = "/";

const ROUTE_NAMES = {
  ROOT: ROOT_ROUTE,
  COUNTER: `/counter`,
  AUTHENTICATION: {
    LOGIN: "/login"
  }
} as const;

export default ROUTE_NAMES;
