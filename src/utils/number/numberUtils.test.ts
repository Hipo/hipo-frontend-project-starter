import {numberToString} from "./numberUtils";

// numberToString
describe("Valid numbers should return it's string value", () => {
  test('numberToString: 1 => "1"', () => {
    expect(numberToString(1)).toBe("1");
  });

  test('numberToString: 0 => "0"', () => {
    expect(numberToString(0)).toBe("0");
  });

  test('numberToString: 1.23 => "1.23"', () => {
    // eslint-disable-next-line no-magic-numbers
    expect(numberToString(1.23)).toBe("1.23");
  });
});

describe("Non-valid values should return empty string", () => {
  test('numberToString: null => ""', () => {
    expect(numberToString(null)).toBe("");
  });

  test('numberToString: undefined => ""', () => {
    expect(numberToString(undefined)).toBe("");
  });

  test('numberToString: NaN => ""', () => {
    expect(numberToString(NaN)).toBe("");
  });
});
