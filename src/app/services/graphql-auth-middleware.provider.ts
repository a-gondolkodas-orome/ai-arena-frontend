import { InMemoryCache, ApolloClientOptions, ApolloLink, Observable } from "@apollo/client/core";
import { APOLLO_OPTIONS } from "apollo-angular";
import { HttpLink } from "apollo-angular/http";
import { LoginStatusService } from "./login-status.service";
import { possibleTypes } from "../apollo-possible-types";
import { environment } from "../../environments/environment";
import { NotificationService } from "./notification.service";

export const GraphqlAuthMiddlewareProvider = {
  provide: APOLLO_OPTIONS,
  useFactory(
    httpLink: HttpLink,
    loginStatusService: LoginStatusService,
    notificationService: NotificationService,
  ): ApolloClientOptions<unknown> {
    const http = httpLink.create({ uri: environment.backendUrl + "/graphql" });
    const handleAuthError = new ApolloLink(function (operation, forward) {
      return new Observable(function (observer) {
        const subscription = forward(operation).subscribe({
          next: (result) => {
            if (
              result.data &&
              Object.values(result.data).some(
                (value) => value?.__typename === "GraphqlAuthenticationError",
              )
            ) {
              loginStatusService.logout();
            } else if (result.errors) {
              notificationService.error(
                result.errors.reduce((msg: string, error) => msg + error.message, ""),
              );
            }
            observer.next(result);
          },

          complete: function () {
            observer.complete.call(observer);
          },
        });

        return () => {
          subscription.unsubscribe();
        };
      });
    });
    const link = handleAuthError.concat(http);

    return {
      link,
      cache: new InMemoryCache({
        possibleTypes,
      }),
    };
  },
  deps: [HttpLink, LoginStatusService, NotificationService],
};
