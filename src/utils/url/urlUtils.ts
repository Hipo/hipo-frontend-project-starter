/**
 * Stringifies an object's key-value pairs into an ampersand (&) separated string. If the given argument is not an object or is an empty object, it returns an empty string.
 * @param {object} params A params object.
 * @return {string} Stringified search string
 */
function stringifySearchParamsObject(params: unknown) {
  return typeof params === "object" && params
    ? Object.entries(params)
        .map((pair) => pair.join("="))
        .flat()
        .join("&")
    : "";
}

export {stringifySearchParamsObject};
