import { Component, OnDestroy, OnInit } from "@angular/core";
import { GetMatchGQL, GetMatchQuery, MatchRunStage } from "../graphql/generated";
import { ActivatedRoute, Router } from "@angular/router";
import { NotificationService } from "../services/notification.service";
import { combineLatest, concatMap, EMPTY, filter, map, Observable, Subscription } from "rxjs";
import { handleGraphqlAuthErrors } from "../error";
import { Location } from "@angular/common";
import { Sse } from "../services/sse";
import { AuthService } from "../services/auth.service";
import * as base64 from "base64-js";

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
    protected authService: AuthService,
    protected location: Location,
  ) {}

  ngOnInit() {
    const matchId = this.route.snapshot.paramMap.get("id");
    if (matchId === null) {
      this.notificationService.error("No match id in path");
      this.matchWithWatchBot$ = EMPTY;
      this.handleBackToGame();
    } else {
      const matchQuery = this.getMatch.watch({ id: matchId });
      const match$ = matchQuery.valueChanges.pipe(
        map((result) => result.data.getMatch),
        filter(<T>(value: T): value is Exclude<T, null | undefined> => {
          if (value != null) return true;
          this.notificationService.error("Match not found");
          return false;
        }),
        handleGraphqlAuthErrors(this.notificationService),
      );
      const user$ = this.authService.userProfile$.pipe(
        filter((user): user is Exclude<typeof user, undefined> => user !== undefined),
      );
      this.matchWithWatchBot$ = combineLatest([match$, user$]).pipe(
        map(([match, user]) => {
          const userBot = match.bots.find(
            (bot) => bot.__typename === "Bot" && bot.user.id === user.id,
          );
          return {
            ...match,
            log: match.logBase64
              ? {
                  binary: base64.toByteArray(match.logBase64),
                  jsonString: atob(match.logBase64),
                }
              : undefined,
            watchBotId: userBot?.id,
          };
        }),
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

  matchWithWatchBot$!: Observable<
    Extract<GetMatchQuery["getMatch"], { __typename: "Match" }> & {
      log?: { binary: ArrayBuffer; jsonString: string };
      watchBotId?: string;
    }
  >;
  protected sseSubscription?: Subscription;

  handleBackToGame() {
    this.location.back();
  }

  ngOnDestroy() {
    this.sseSubscription?.unsubscribe();
  }
}
