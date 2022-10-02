import { filter, OperatorFunction } from "rxjs";
import { NotificationService } from "./services/notification.service";

type WithoutAuthErrors<T> = Exclude<
  T,
  | { __typename: "GraphqlAuthenticationError"; message: string }
  | { __typename: "GraphqlAuthorizationError"; message: string }
>;

export function handleGraphqlAuthErrors<T>(
  notificationService: NotificationService,
): OperatorFunction<T, WithoutAuthErrors<T>> {
  return filter((result: unknown): result is WithoutAuthErrors<T> => {
    const error = result as { __typename: string; message: string };
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
