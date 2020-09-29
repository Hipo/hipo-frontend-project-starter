import {isNull, not, pipe} from "./functionUtils";

it("isNull - works expectedly", () => {
  expect(isNull(null)).toBe(true);
  expect(isNull(undefined)).toBe(false);
  expect(isNull("")).toBe(false);
  expect(isNull(0)).toBe(false);
  expect(isNull(NaN)).toBe(false);
  expect(isNull(false)).toBe(false);
  expect(isNull(true)).toBe(false);
  expect(isNull(Infinity)).toBe(false);
});

describe("not", () => {
  it("should filter out null values", () => {
    expect(
      [1, null, 0, null, "", "foo", {}, null, {a: "b"}].filter(not(isNull)).join()
    ).toBe([1, 0, "", "foo", {}, {a: "b"}].join());
  });
});

/* eslint-disable no-magic-numbers */
describe("pipe", () => {
  const add5 = (x: number) => 5 + x;
  const subtract2 = (x: number) => x - 2;
  const square = (x: number) => x * x;

  it("should apply functions from left to right", () => {
    expect(pipe(add5, subtract2, square)(1)).toBe(16);
  });
});
/* eslint-enable no-magic-numbers */
