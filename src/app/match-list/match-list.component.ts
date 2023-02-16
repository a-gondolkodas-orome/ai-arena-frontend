import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Match, DeleteMatchGQL, Game, GetMatchesGQL, GetMatchGQL } from "../graphql/generated";
import { MatDialog } from "@angular/material/dialog";
import { NotificationService } from "../services/notification.service";
import { concatMap, filter, map, Observable, Subscription } from "rxjs";
import { handleGraphqlAuthErrors } from "../error";
import { StartMatchDialogComponent } from "../start-match-dialog/start-match-dialog.component";
import * as t from "io-ts";
import { decode, getEvalStatus } from "../../utils";
import { Sse } from "../services/sse";

@Component({
  selector: "app-match-list",
  templateUrl: "./match-list.component.html",
  styleUrls: ["./match-list.component.scss"],
})
export class MatchListComponent implements OnInit, OnDestroy {
  static getMatchesCacheCodec = t.type({
    __typename: t.literal("Matches"),
    matches: t.array(t.type({ __ref: t.string })),
  });

  @Input() game!: Game;

  constructor(
    protected dialog: MatDialog,
    protected getMatches: GetMatchesGQL,
    protected getMatch: GetMatchGQL,
    protected notificationService: NotificationService,
    protected deleteMatchMutation: DeleteMatchGQL,
  ) {}

  matches$?: Observable<(Pick<Match, "id"> & { evalStatus: string })[]>;
  protected sseSubscription?: Subscription;

  ngOnInit() {
    this.matches$ = this.getMatches.watch({ gameId: this.game.id }).valueChanges.pipe(
      map((result) => result.data.getMatches),
      handleGraphqlAuthErrors(this.notificationService),
      map((getMatches) =>
        getMatches.matches.map((match) => ({
          ...match,
          evalStatus: getEvalStatus(match.runStatus.stage),
        })),
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

  startMatch() {
    this.dialog.open(StartMatchDialogComponent, {
      data: StartMatchDialogComponent.startMatchDialogDataCodec.encode({
        gameId: this.game.id,
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
