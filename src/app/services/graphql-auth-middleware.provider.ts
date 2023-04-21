import { ApolloClientOptions, ApolloLink, InMemoryCache, Observable } from "@apollo/client/core";
import { APOLLO_OPTIONS } from "apollo-angular";
import { HttpLink } from "apollo-angular/http";
import { LoginStatusService } from "./login-status.service";
import { possibleTypes, typePolicies } from "../apollo-cache-config";
import { environment } from "../../environments/environment";
import { NotificationService } from "./notification.service";
import { decode } from "../../utils";
import { aiArenaExceptionCodec } from "../error";
import { ErrorType } from "../../common";
import { JwtToken } from "./jwt-token";

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
              ) &&
              JwtToken.get()
            ) {
              loginStatusService.logout();
            } else if (result.errors) {
              const aiArenaException = decode(aiArenaExceptionCodec, result.errors[0], null);
              if (!aiArenaException || aiArenaException.type !== ErrorType.AUTHENTICATION_ERROR)
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
        typePolicies,
      }),
    };
  },
  deps: [HttpLink, LoginStatusService, NotificationService],
};
