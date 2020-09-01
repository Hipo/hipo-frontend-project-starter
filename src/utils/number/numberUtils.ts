/**
 * Coerces a number into a string.
 * @param {number} value A number to convert to string
 * @return {string} The value after coercing the given value to a string.
 */
function numberToString(value: unknown): string {
  return typeof value === "number" && !Object.is(value, NaN) ? String(value) : "";
}

export {numberToString};
