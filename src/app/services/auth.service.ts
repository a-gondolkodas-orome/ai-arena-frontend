import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Apollo } from "apollo-angular";
import { concatMap, map, ReplaySubject } from "rxjs";
import { LoginStatusService } from "./login-status.service";
import { JwtToken } from "./jwt-token";
import { GetProfileGQL, User } from "../graphql/generated";
import { Sse } from "./sse";
import { NotificationService } from "./notification.service";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  constructor(
    protected apollo: Apollo,
    protected getProfile: GetProfileGQL,
    protected router: Router,
    loginStatusService: LoginStatusService,
    protected notificationService: NotificationService,
  ) {
    this.profileQuery = getProfile.watch();
    this.profileQuery.valueChanges
      .pipe(map((result) => result.data.profile))
      .subscribe((response) => {
        if (response.__typename === "User") {
          this.userProfile$.next(response);
          const token = JwtToken.get();
          if (token) Sse.open(token);
          else
            notificationService.error(`Token not found for logged in user: ${response.username}`);
        }
      });
    loginStatusService.loginStatus$
      .pipe(
        concatMap(async (statusEvent) => {
          if (statusEvent.type === "login") {
            JwtToken.set(statusEvent.token);
            await this.router.navigate([statusEvent.returnUrl ?? ""]);
          } else {
            JwtToken.clear();
            Sse.close();
            this.userProfile$.next(undefined);
            await this.router.navigate(["login"]);
          }
          await this.apollo.client.resetStore();
        }),
      )
      .subscribe();
  }

  profileQuery;
  userProfile$ = new ReplaySubject<User | undefined>(1);
}
