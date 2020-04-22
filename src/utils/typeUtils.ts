type ValueOf<T> = T[keyof T];
type ArrayToUnion<T extends readonly any[]> = T[number];
type CallbackFunction = (...args: any[]) => void;

export {ValueOf, ArrayToUnion, CallbackFunction};
