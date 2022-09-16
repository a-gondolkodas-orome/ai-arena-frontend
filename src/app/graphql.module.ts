import { NgModule } from "@angular/core";
import { APOLLO_OPTIONS, ApolloModule } from "apollo-angular";
import {
  ApolloClientOptions,
  ApolloLink,
  InMemoryCache,
} from "@apollo/client/core";
import { HttpLink } from "apollo-angular/http";
import { HttpHeaders } from "@angular/common/http";
import { AuthService } from "./auth.service";
import { onError } from "@apollo/client/link/error";
import { Router } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { ErrorType } from "../errors";

const uri = "http://localhost:3000/graphql"; // <-- add the URL of the GraphQL server here

@NgModule({
  exports: [ApolloModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory(
        httpLink: HttpLink,
        router: Router,
      ): ApolloClientOptions<unknown> {
        const http = httpLink.create({ uri });
        const addJwt = new ApolloLink((operation, forward) => {
          const token = AuthService.getToken();
          if (token) {
            operation.setContext({
              headers: new HttpHeaders().set(
                "Authorization",
                `Bearer ${token}`,
              ),
            });
          }
          return forward(operation);
        });
        const handleAuthError = onError(({ graphQLErrors, operation }) => {
          if (
            operation.operationName !== LoginComponent.OPERATION_NAME &&
            graphQLErrors?.find(
              (error) =>
                error.extensions["code"] === ErrorType.AUTHENTICATION_ERROR,
            )
          ) {
            router.navigate(["login"]);
          }
        });
        const link = addJwt.concat(handleAuthError).concat(http);

        return {
          link,
          cache: new InMemoryCache(),
        };
      },
      deps: [HttpLink, Router],
    },
  ],
})
export class GraphQLModule {}
