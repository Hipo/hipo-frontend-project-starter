const TARGET_ENV_TYPES: {[x: string]: typeof TARGET_ENV_TYPE} = {
  LOCAL: "local",
  PRODUCTION: "production",
  STAGING: "staging"
};

function isDevelopmentEnv() {
  return BUILD_TYPE === "dev";
}

function isProduction() {
  return TARGET_ENV_TYPES.PRODUCTION === TARGET_ENV_TYPE;
}

function isStaging() {
  return TARGET_ENV_TYPES.STAGING === TARGET_ENV_TYPE;
}

export {TARGET_ENV_TYPES, isDevelopmentEnv, isProduction, isStaging};
