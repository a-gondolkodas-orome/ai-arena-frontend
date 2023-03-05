import * as t from "io-ts";
import { either } from "fp-ts";

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Time {
  export const msec = 1;
  export const second = 1000 * msec;
  export const minute = 60 * second;
  export const hour = 60 * minute;
  export const day = 24 * hour;
}

export function notNull<T>(value: T): Exclude<T, null | undefined> {
  if (value === null || value === undefined) throw new Error(`notNull: value is ${value}`);
  return value as Exclude<T, null | undefined>;
}

export function catchWithInfo(promise: Promise<unknown>, filename: string, location: string) {
  promise.catch((error) => {
    throw new Error(`${error.message()} at ${filename} - ${location}`);
  });
}

export function decode<A, O, I>(codec: t.Type<A, O, I>, input: I): A;
export function decode<A, O, I, D>(codec: t.Type<A, O, I>, input: I, defaultValue: D): A | D;
export function decode<A, O, I, D>(codec: t.Type<A, O, I>, input: I, defaultValue?: D): A | D {
  const decodeResult = codec.decode(input);
  if (either.isLeft(decodeResult)) {
    if (defaultValue === undefined) throw new Error("decode: invalid input");
    else return defaultValue;
  }
  return decodeResult.right;
}

export function enumCodec<T extends object>(enumType: T, enumName: string) {
  const isEnumValue = (input: unknown): input is T[keyof T] =>
    Object.values(enumType).includes(input);

  return new t.Type<T[keyof T]>(
    enumName,
    isEnumValue,
    (input, context) => (isEnumValue(input) ? t.success(input) : t.failure(input, context)),
    t.identity,
  );
}

export function getEvalStatus(stage: string) {
  if (stage.endsWith("SUCCESS")) return "eval-success";
  if (stage.endsWith("ERROR")) return "eval-error";
  return "eval-in-progress";
}
