import { Component, OnDestroy, OnInit } from "@angular/core";
import { GetMatchGQL, GetMatchQuery, MatchRunStage } from "../graphql/generated";
import { ActivatedRoute, Router } from "@angular/router";
import { NotificationService } from "../services/notification.service";
import { concatMap, EMPTY, filter, map, Observable, Subscription } from "rxjs";
import { handleGraphqlAuthErrors } from "../error";
import { Location } from "@angular/common";
import { Sse } from "../services/sse";

@Component({
  selector: "app-match",
  templateUrl: "./match.component.html",
  styleUrls: ["./match.component.scss"],
})
export class MatchComponent implements OnInit, OnDestroy {
  readonly MatchRunStage = MatchRunStage;

  constructor(
    protected getMatch: GetMatchGQL,
    protected route: ActivatedRoute,
    protected router: Router,
    protected notificationService: NotificationService,
    protected location: Location,
  ) {}

  ngOnInit() {
    const matchId = this.route.snapshot.paramMap.get("id");
    if (matchId === null) {
      this.notificationService.error("No match id in path");
      this.match$ = EMPTY;
      this.handleBackToGame();
    } else {
      const matchQuery = this.getMatch.watch({ id: matchId });
      this.match$ = matchQuery.valueChanges.pipe(
        map((result) => result.data.getMatch),
        filter(<T>(value: T): value is Exclude<T, null | undefined> => {
          if (value != null) return true;
          this.notificationService.error("Match not found");
          return false;
        }),
        handleGraphqlAuthErrors(this.notificationService),
      );
      this.sseSubscription = Sse.matchEvents
        .pipe(
          concatMap((event) => {
            return event.matchUpdate === matchId ? matchQuery.refetch() : EMPTY;
          }),
        )
        .subscribe();
    }
  }

  match$?: Observable<Extract<GetMatchQuery["getMatch"], { __typename: "Match" }>>;
  protected sseSubscription?: Subscription;

  handleBackToGame() {
    this.location.back();
  }

  ngOnDestroy() {
    this.sseSubscription?.unsubscribe();
  }
}
