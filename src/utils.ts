import * as t from "io-ts";
import { either } from "fp-ts";

export function notNull<T>(value: T): Exclude<T, null | undefined> {
  if (value === null || value === undefined)
    throw new Error(`notNull: value is ${value}`);
  return value as Exclude<T, null | undefined>;
}

export function catchWithInfo(
  promise: Promise<unknown>,
  filename: string,
  location: string,
) {
  promise.catch((error) => {
    throw new Error(`${error.message()} at ${filename} - ${location}`);
  });
}

export function decode<A, O, I>(codec: t.Type<A, O, I>, input: I): A {
  const decodeResult = codec.decode(input);
  if (either.isLeft(decodeResult)) {
    throw new Error("decode: invalid input");
  }
  return decodeResult.right;
}
