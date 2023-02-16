import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Apollo } from "apollo-angular";
import { map, ReplaySubject, Subscription } from "rxjs";
import { LoginStatusService } from "./login-status.service";
import { JwtToken } from "./jwt-token";
import { GetProfileGQL, User } from "../graphql/generated";
import { Sse } from "./sse";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  constructor(
    protected apollo: Apollo,
    protected getProfile: GetProfileGQL,
    protected router: Router,
    loginStatusService: LoginStatusService,
  ) {
    const token = JwtToken.get();
    if (token) {
      this.setProfile(token);
    }
    loginStatusService.loginStatus$.subscribe(async (statusEvent) => {
      if (statusEvent.type === "login") await this.handleLogin(statusEvent.token);
      else await this.handleLogout();
    });
  }

  userProfile$ = new ReplaySubject<User | undefined>(1);
  protected getProfileSubscription?: Subscription;

  setProfile(token: string) {
    this.getProfileSubscription = this.getProfile
      .watch()
      .valueChanges.pipe(map((result) => result.data.profile))
      .subscribe((response) => {
        if (response.__typename === "User") {
          this.userProfile$.next(response);
          Sse.open(token);
        }
      });
  }

  async handleLogin(token: string) {
    JwtToken.set(token);
    this.setProfile(token);
  }

  async handleLogout() {
    JwtToken.clear();
    Sse.close();
    this.getProfileSubscription?.unsubscribe();
    this.userProfile$.next(undefined);
    await this.apollo.client.clearStore();
    await this.router.navigate(["login"]);
  }
}
