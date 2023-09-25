import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import {
  DeleteMatchGQL,
  GetMatchesGQL,
  GetMatchGQL,
  GetContestMatchesGQL,
  MatchHeadFragment,
  GraphqlValidationError,
} from "../graphql/generated";
import { MatDialog } from "@angular/material/dialog";
import { NotificationService } from "../services/notification.service";
import { combineLatest, concatMap, filter, map, Observable, Subscription } from "rxjs";
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
import { MatCheckboxModule } from "@angular/material/checkbox";
import { scoresCodec } from "../../common";
import { FormsModule } from "@angular/forms";
import { AuthService } from "../services/auth.service";

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
    MatCheckboxModule,
    FormsModule,
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
    protected authService: AuthService,
    protected deleteMatchMutation: DeleteMatchGQL,
  ) {}

  readonly MATCH_LIST__UNAUTHORIZED = "MATCH_LIST__UNAUTHORIZED" as const;

  enableCreateMatch = false;
  enableDeleteMatch = false;
  filterOwnMatches?: boolean;
  matches$?: Observable<
    | (MatchHeadFragment & {
        evalStatus: string;
        scoreboard?: { id: string; name: string | null; score: number | null }[];
        isOwnMatch: boolean;
      })[]
    | typeof this.MATCH_LIST__UNAUTHORIZED
  >;
  protected sseSubscription?: Subscription;

  ngOnInit() {
    this.enableCreateMatch = this.context.__typename === "Game";
    this.enableDeleteMatch = this.context.__typename === "Game";
    const matches$ =
      this.context.__typename === "Game"
        ? this.getMatches.watch({ gameId: this.context.id }).valueChanges.pipe(
            map((result) => result.data.getMatches),
            handleGraphqlAuthErrors(this.notificationService),
            map((getMatches) => getMatches.matches),
          )
        : this.getContestMatches.watch({ id: this.context.id }).valueChanges.pipe(
            map((result) => result.data.getContest),
            filter(
              <T>(value: T): value is Exclude<T, GraphqlValidationError | null | undefined> => {
                if (value == null) {
                  this.notificationService.error("Contest not found");
                  return false;
                }
                const validationError = value as unknown as GraphqlValidationError;
                if (validationError.__typename === "GraphqlValidationError") {
                  this.notificationService.error(validationError.message);
                  return false;
                }
                return true;
              },
            ),
            handleGraphqlAuthErrors(this.notificationService),
            map((getContest) => getContest.matches),
          );
    const user$ = this.authService.userProfile$.pipe(
      filter((user): user is Exclude<typeof user, undefined> => user !== undefined),
    );
    this.matches$ = combineLatest([matches$, user$]).pipe(
      map(
        ([matches, user]) =>
          matches?.map((match) => {
            return {
              ...match,
              evalStatus: getEvalStatus(match.runStatus.stage),
              scoreboard: this.getScoreboard(match),
              isOwnMatch: match.bots.some(
                (bot) => bot.__typename === "Bot" && bot.user.id === user.id,
              ),
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
    if (this.context.__typename === "Contest") this.filterOwnMatches = false;
  }

  protected getScoreboard(match: MatchHeadFragment) {
    if (!match.scoreJson) {
      return match.bots.map((bot) => ({
        id: bot.id,
        name: bot.__typename === "Bot" ? bot.name : null,
        score: null,
      }));
    }
    const botsById = new Map(
      match.bots
        .filter((bot): bot is Exclude<typeof bot, null> => bot !== null)
        .map((bot) => [bot.id, bot]),
    );
    const scores = decodeJson(scoresCodec, match.scoreJson);
    return Object.entries(scores)
      .map(([id, score]) => {
        const indexedId = id.match(/^(?<id>[0-9a-f]{24})\.\d+$/);
        if (indexedId?.groups) id = indexedId.groups["id"];
        const bot = botsById.get(id);
        if (!bot) this.notificationService.error("Unknown bot id in match scores: " + id);
        const name =
          !bot || bot.__typename == "DeletedBot"
            ? null
            : this.context.__typename === "Game"
            ? bot.name
            : bot.user.username;
        return { id, name, score };
      })
      .sort((a, b) => b.score - a.score);
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
                getMatches: (cacheValue: unknown, { DELETE }: { DELETE: unknown }) => {
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
