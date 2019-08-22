import {numberToString} from "./numberUtils";

// numberToString
test('numberToString: 1 => "1"', () => {
  expect(numberToString(1)).toBe("1");
});

test('numberToString: 0 => "0"', () => {
  expect(numberToString(0)).toBe("0");
});

test('numberToString: null => ""', () => {
  expect(numberToString(null)).toBe("");
});

test('numberToString: undefined => ""', () => {
  expect(numberToString(undefined)).toBe("");
});

test('numberToString: NaN => ""', () => {
  expect(numberToString(NaN)).toBe("");
});
