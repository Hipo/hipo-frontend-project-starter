/**
 * Returns a negated function that invokes the passed in function and returns the logical negation of its return value.
 * @param {function} fn A function
 * @returns {function} Negated function
 */
function not(fn: (item: any) => boolean) {
  return function negated(item: any) {
    return !fn(item);
  };
}

/**
 * Checks if value is null
 * @param {any} x Value
 * @returns {boolean} Returns true if the provided value is null
 */
function isNull(x: unknown): x is null {
  return Object.is(x, null);
}

/**
 * Returns the passed in argument.
 * @param {any} value Any value
 * @returns {any} value
 */
function identityFn<U>(value: U): U {
  return value;
}

/**
 * Implements `pipe` function composition utility.
 *
 * Usage:
 *    pipe(f1,f2,f3)(value)    is the same as f3(f2(f1(value)))
 */
function pipe<A extends any[], B, C, D>(
  f: (...arg: A) => B,
  g: (arg: B) => C,
  h: (arg: C) => D
): (...arg: A) => D;
function pipe<A extends any[], B, C>(
  f: (...arg: A) => B,
  g: (arg: B) => C
): (...arg: A) => C;
function pipe<A extends any[], R>(fn1: (...args: A) => R, ...fns: Array<(a: R) => R>) {
  const piped = fns.reduce(
    (prevFn, nextFn) => (value: R) => nextFn(prevFn(value)),
    identityFn
  );

  return (...args: A) => piped(fn1(...args));
}

export {not, isNull, pipe};
