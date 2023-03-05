import { filter, OperatorFunction } from "rxjs";
import { NotificationService } from "./services/notification.service";
import { GraphqlAuthenticationError, GraphqlAuthorizationError } from "./graphql/generated";
import { FormGroup } from "@angular/forms";
import * as t from "io-ts";
import { enumCodec } from "../utils";
import { ErrorType } from "../common";

type WithoutAuthErrors<T> = Exclude<T, GraphqlAuthenticationError | GraphqlAuthorizationError>;

export function handleGraphqlAuthErrors<T>(
  notificationService: NotificationService,
): OperatorFunction<T, WithoutAuthErrors<T>> {
  return filter((result: unknown): result is WithoutAuthErrors<T> => {
    const error = result as GraphqlAuthenticationError | GraphqlAuthorizationError;
    if (
      error.__typename === "GraphqlAuthenticationError" ||
      error.__typename === "GraphqlAuthorizationError"
    ) {
      notificationService.error(error.message);
      return false;
    }
    return true;
  });
}

type ValidationError = {
  __typename: string;
  fieldErrors?: Record<string, string[]>;
  nonFieldErrors?: string[];
};

export function handleValidationErrors<T, E>(
  errorTypename: E,
  notificationService: NotificationService,
  form: FormGroup,
): OperatorFunction<T, Exclude<T, { __typename: E }>> {
  return filter((value: unknown): value is Exclude<T, { __typename: E }> => {
    const error = value as ValidationError;
    if (error.__typename !== errorTypename) return true;
    const nonFieldErrors = error.nonFieldErrors ?? [];
    for (const [field, errors] of Object.entries(error.fieldErrors ?? {})) {
      if (field === "__typename" || !errors?.length) continue;
      const formField = form.get(field);
      if (formField) {
        formField.setErrors({ serverError: errors.join(", ") });
      } else {
        nonFieldErrors.push(`${field} error: ${errors.join(", ")}`);
      }
    }
    if (nonFieldErrors.length) {
      notificationService.error(nonFieldErrors.join("\n"));
    }
    return false;
  });
}

export const aiArenaExceptionCodec = t.type({
  type: enumCodec(ErrorType, "ErrorType"),
  message: t.string,
});
