import {stringifySearchParamsObject} from "./urlUtils";

describe("stringifySearchParamsObject", () => {
  it("should return empty string when given a non-object value", () => {
    expect(stringifySearchParamsObject(undefined)).toBe("");
    expect(stringifySearchParamsObject(null)).toBe("");
    expect(stringifySearchParamsObject(0)).toBe("");
    expect(stringifySearchParamsObject(NaN)).toBe("");
    expect(stringifySearchParamsObject(Infinity)).toBe("");
    expect(stringifySearchParamsObject("None")).toBe("");
  });

  it("should return empty string when given an empty object", () => {
    expect(stringifySearchParamsObject({})).toBe("");
  });

  it("should be able to handle objects with only one property", () => {
    expect(
      stringifySearchParamsObject({
        a: "123"
      })
    ).toBe("a=123");
    expect(
      stringifySearchParamsObject({
        a: 0
      })
    ).toBe("a=0");
    expect(
      stringifySearchParamsObject({
        a: false
      })
    ).toBe("a=false");
    expect(
      stringifySearchParamsObject({
        a: true
      })
    ).toBe("a=true");
    expect(
      stringifySearchParamsObject({
        // eslint-disable-next-line no-magic-numbers
        a: [1, 2, 3]
      })
    ).toBe("a=1,2,3");
  });

  it("should be able to handle objects with multiple properties", () => {
    expect(
      stringifySearchParamsObject({
        a: "123",
        b: 0,
        c: true,
        d: false,
        // eslint-disable-next-line no-magic-numbers
        e: [1, 2, 3]
      })
    ).toBe("a=123&b=0&c=true&d=false&e=1,2,3");
  });
});
