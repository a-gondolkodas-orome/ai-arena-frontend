import * as t from "io-ts";

export enum ErrorType {
  VALIDATION_ERROR = "VALIDATION_ERROR",
  ASSERT_EXCEPTION = "ASSERT_EXCEPTION",
  AUTHENTICATION_ERROR = "AUTHENTICATION_ERROR",
  AUTHORIZATION_ERROR = "AUTHORIZATION_ERROR",
}

export const validationErrorCodec = t.partial(
  {
    fieldErrors: t.record(t.string, t.array(t.string)),
    nonFieldErrors: t.array(t.string),
  },
  "validationErrorCodec",
);

export const assertExceptionCodec = t.partial(
  { message: t.string, values: t.record(t.string, t.unknown) },
  "assertExceptionCodec",
);

export const authenticationErrorCodec = t.partial(
  { message: t.string },
  "authenticationErrorCodec",
);

export const authorizationErrorCodec = t.partial(
  { message: t.string },
  "authorizationErrorCodec",
);

export const aiArenaExceptionCodec = t.union([
  t.intersection([
    t.type({ type: t.literal(ErrorType.VALIDATION_ERROR) }),
    validationErrorCodec,
  ]),
  t.intersection([
    t.type({ type: t.literal(ErrorType.ASSERT_EXCEPTION) }),
    assertExceptionCodec,
  ]),
  t.intersection([
    t.type({ type: t.literal(ErrorType.AUTHENTICATION_ERROR) }),
    authenticationErrorCodec,
  ]),
  t.intersection([
    t.type({ type: t.literal(ErrorType.AUTHORIZATION_ERROR) }),
    authorizationErrorCodec,
  ]),
]);
