import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import {
  DeleteMatchGQL,
  GetMatchesGQL,
  GetMatchGQL,
  GetContestMatchesGQL,
  MatchHeadFragment,
} from "../graphql/generated";
import { MatDialog } from "@angular/material/dialog";
import { NotificationService } from "../services/notification.service";
import { concatMap, filter, map, Observable, Subscription } from "rxjs";
import { handleGraphqlAuthErrors } from "../error";
import { StartMatchDialogComponent } from "../start-match-dialog/start-match-dialog.component";
import * as t from "io-ts";
import { decode, decodeJson, getEvalStatus } from "../../utils";
import { Sse } from "../services/sse";
import { CommonModule } from "@angular/common";
import { MatListModule } from "@angular/material/list";
import { MatCardModule } from "@angular/material/card";
import { RouterLink } from "@angular/router";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatButtonModule } from "@angular/material/button";
import { GetContestQueryResult, GetGameQueryResult } from "../../types";
import { MatChipsModule } from "@angular/material/chips";

@Component({
  standalone: true,
  selector: "app-match-list",
  templateUrl: "./match-list.component.html",
  styleUrls: ["./match-list.component.scss"],
  imports: [
    CommonModule,
    MatListModule,
    MatCardModule,
    RouterLink,
    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatChipsModule,
  ],
})
export class MatchListComponent implements OnInit, OnDestroy {
  static getMatchesCacheCodec = t.type({
    __typename: t.literal("Matches"),
    matches: t.array(t.type({ __ref: t.string })),
  });

  @Input() context!: GetGameQueryResult | GetContestQueryResult;

  constructor(
    protected dialog: MatDialog,
    protected getMatches: GetMatchesGQL,
    protected getMatch: GetMatchGQL,
    protected getContestMatches: GetContestMatchesGQL,
    protected notificationService: NotificationService,
    protected deleteMatchMutation: DeleteMatchGQL,
  ) {}

  readonly MATCH_LIST__UNAUTHORIZED = "MATCH_LIST__UNAUTHORIZED" as const;

  enableCreateMatch = false;
  matches$?: Observable<
    | (MatchHeadFragment & {
        evalStatus: string;
        scoreboard?: { id: string; name: string; score: number }[];
      })[]
    | typeof this.MATCH_LIST__UNAUTHORIZED
  >;
  protected sseSubscription?: Subscription;

  ngOnInit() {
    this.enableCreateMatch = this.context.__typename === "Game";
    const matches$ =
      this.context.__typename === "Game"
        ? this.getMatches.watch({ gameId: this.context.id }).valueChanges.pipe(
            map((result) => result.data.getMatches),
            handleGraphqlAuthErrors(this.notificationService),
            map((getMatches) => getMatches.matches),
          )
        : this.getContestMatches.watch({ id: this.context.id }).valueChanges.pipe(
            map((result) => result.data.getContest),
            filter(<T>(value: T): value is Exclude<T, null | undefined> => {
              if (value != null) return true;
              this.notificationService.error("Contest not found");
              return false;
            }),
            handleGraphqlAuthErrors(this.notificationService),
            map((getContest) => getContest.matches),
          );
    this.matches$ = matches$.pipe(
      map(
        (matches) =>
          matches?.map((match) => {
            const scores =
              (match.result && decodeJson(t.record(t.string, t.number), match.result.scoreJson)) ||
              undefined;
            const scoreboard = scores && this.getScoreboard(match, scores);
            return {
              ...match,
              evalStatus: getEvalStatus(match.runStatus.stage),
              scoreboard,
            };
          }) ?? this.MATCH_LIST__UNAUTHORIZED,
      ),
    );
    this.sseSubscription = Sse.matchEvents
      .pipe(
        concatMap((event) =>
          this.getMatch.fetch({ id: event.matchUpdate }, { fetchPolicy: "network-only" }),
        ),
      )
      .subscribe();
  }

  protected getScoreboard(match: MatchHeadFragment, scores: { [key: string]: number }) {
    const scoreboard = [];
    const botCounter = new Map<string, number>();
    for (const bot of match.bots) {
      const index = botCounter.get(bot.id) ?? 0;
      botCounter.set(bot.id, index + 1);
      const score = scores[index ? `${bot.id}.${index}` : bot.id];
      scoreboard.push({
        id: bot.id,
        name: this.context.__typename === "Game" ? bot.name : bot.user.username,
        score,
      });
    }
    return scoreboard.sort((a, b) => b.score - a.score);
  }

  startMatch() {
    if (this.context.__typename !== "Game") {
      this.notificationService.error(`Can't start matches from a [${this.context.__typename}]`);
      return;
    }
    this.dialog.open(StartMatchDialogComponent, {
      data: StartMatchDialogComponent.startMatchDialogDataCodec.encode({
        gameId: this.context.id,
      }),
    });
  }

  protected deleteMatchSubscription?: Subscription;

  deleteMatch(id: string, event: MouseEvent) {
    event.stopPropagation();
    this.deleteMatchSubscription = this.deleteMatchMutation
      .mutate(
        { id },
        {
          update: (cache, { data }) => {
            const cacheId = cache.identify({ __typename: "Match", id });
            cache.modify({
              fields: {
                getMatches: (cacheValue: unknown, { DELETE }) => {
                  const getMatches = decode(MatchListComponent.getMatchesCacheCodec, cacheValue);
                  if (data == null || data.deleteMatch !== null || !cacheId) return DELETE;

                  return {
                    ...getMatches,
                    matches: getMatches.matches.filter((match) => match.__ref !== cacheId),
                  };
                },
              },
            });
            cache.evict({ id: cacheId });
          },
        },
      )
      .pipe(
        map((result) => result.data),
        filter((value): value is Exclude<typeof value, null | undefined> => {
          if (value != null) return true;
          this.notificationService.error("No data returned from match deletion");
          return false;
        }),
        map((data) => data.deleteMatch),
        filter((value): value is Exclude<typeof value, null> => {
          return value !== null;
        }),
        handleGraphqlAuthErrors(this.notificationService),
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.deleteMatchSubscription?.unsubscribe();
    this.sseSubscription?.unsubscribe();
  }
}
