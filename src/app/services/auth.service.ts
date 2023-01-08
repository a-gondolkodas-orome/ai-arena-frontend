import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Apollo } from "apollo-angular";
import { BehaviorSubject, map, Subscription } from "rxjs";
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
      this.setProfile();
      Sse.open(token);
    }
    loginStatusService.loginStatus$.subscribe(async (statusEvent) => {
      if (statusEvent.type === "login") await this.handleLogin(statusEvent.token);
      else await this.handleLogout();
    });
  }

  userProfile$ = new BehaviorSubject<User | undefined>(undefined);
  protected getProfileSubscription?: Subscription;

  setProfile() {
    this.getProfileSubscription = this.getProfile
      .watch()
      .valueChanges.pipe(map((result) => result.data.profile))
      .subscribe((response) => {
        if (response.__typename === "User") {
          this.userProfile$.next(response);
        }
      });
  }

  async handleLogin(token: string) {
    JwtToken.set(token);
    Sse.open(token);
    this.setProfile();
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
