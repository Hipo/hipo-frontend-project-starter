function numberToString(value: unknown) {
  return typeof value === "number" && !Object.is(value, NaN) ? String(value) : "";
}

export {numberToString};
