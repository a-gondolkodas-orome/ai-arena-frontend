import { Component, OnDestroy, OnInit } from "@angular/core";
import { Apollo, graphql } from "apollo-angular";
import { map, Observable, Subscription } from "rxjs";
import { User } from "../../models/user";
import { AuthService } from "../auth.service";
import { Router } from "@angular/router";

type ProfileQueryResponse = { profile: User };

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit, OnDestroy {
  static readonly PROFILE_QUERY = graphql`
    query GetProfile {
      profile {
        username
        email
      }
    }
  `;

  constructor(protected apollo: Apollo, protected router: Router) {}

  protected getProfileSubscription?: Subscription;
  profile?: Observable<User>;

  ngOnInit() {
    this.profile = this.apollo
      .query<ProfileQueryResponse>({ query: DashboardComponent.PROFILE_QUERY })
      .pipe(map((result) => result.data.profile));
    this.getProfileSubscription = this.profile.subscribe();
  }

  ngOnDestroy() {
    this.getProfileSubscription?.unsubscribe();
  }

  async onLogout() {
    AuthService.clearToken();
    await this.apollo.client.clearStore();
    await this.router.navigate(["login"]);
  }
}
