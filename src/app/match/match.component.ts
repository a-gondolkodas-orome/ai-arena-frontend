import { Component } from "@angular/core";
import { GetMatchGQL, Match } from "../graphql/generated";
import { ActivatedRoute, Router } from "@angular/router";
import { NotificationService } from "../services/notification.service";
import { EMPTY, filter, map, Observable } from "rxjs";
import { handleGraphqlAuthErrors } from "../error";
import { Location } from "@angular/common";

type MatchInfo = Pick<Match, "result">;

@Component({
  selector: "app-match",
  templateUrl: "./match.component.html",
  styleUrls: ["./match.component.scss"],
})
export class MatchComponent {
  constructor(
    protected getMatch: GetMatchGQL,
    protected route: ActivatedRoute,
    protected router: Router,
    protected notificationService: NotificationService,
    protected location: Location,
  ) {
    const matchId = this.route.snapshot.paramMap.get("id");
    if (matchId === null) {
      this.notificationService.error("No match id in path");
      this.match$ = EMPTY;
      this.handleBackToGame();
    } else {
      this.match$ = this.getMatch.watch({ id: matchId }).valueChanges.pipe(
        map((result) => result.data.getMatch),
        filter(<T>(value: T): value is Exclude<T, null | undefined> => {
          if (value != null) return true;
          this.notificationService.error("Match not found");
          return false;
        }),
        handleGraphqlAuthErrors(this.notificationService),
      );
    }
  }

  match$: Observable<MatchInfo>;

  handleBackToGame() {
    this.location.back();
  }
}
