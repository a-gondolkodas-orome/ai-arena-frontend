import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import {
  Match,
  DeleteMatchGQL,
  Game,
  GetMatchesGQL,
} from "../graphql/generated";
import { MatDialog } from "@angular/material/dialog";
import { NotificationService } from "../services/notification.service";
import { filter, map, Observable, Subscription } from "rxjs";
import { handleGraphqlAuthErrors } from "../error";
import { StartMatchDialogComponent } from "../start-match-dialog/start-match-dialog.component";
import * as t from "io-ts";
import { decode } from "../../utils";

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
    protected notificationService: NotificationService,
    protected deleteMatchMutation: DeleteMatchGQL,
  ) {}

  matches$?: Observable<Pick<Match, "id">[]>;

  ngOnInit() {
    this.matches$ = this.getMatches
      .watch({ gameId: this.game.id })
      .valueChanges.pipe(
        map((result) => result.data.getMatches),
        handleGraphqlAuthErrors(this.notificationService),
        map((getMatches) => getMatches.matches),
      );
  }

  startMatch() {
    this.dialog.open(StartMatchDialogComponent, {
      data: StartMatchDialogComponent.startMatchDialogDataCodec.encode({
        gameId: this.game.id,
      }),
    });
  }

  protected deleteMatchSubscription?: Subscription;

  deleteMatch(matchId: string) {
    this.deleteMatchSubscription = this.deleteMatchMutation
      .mutate(
        { matchId },
        {
          update: (cache, { data }) => {
            const id = cache.identify({ __typename: "Match", id: matchId });
            cache.modify({
              fields: {
                getMatches: (cacheValue: unknown, { DELETE }) => {
                  const getMatches = decode(
                    MatchListComponent.getMatchesCacheCodec,
                    cacheValue,
                  );
                  if (data == null || data.deleteMatch !== null || !id)
                    return DELETE;

                  return {
                    ...getMatches,
                    matches: getMatches.matches.filter(
                      (match) => match.__ref !== id,
                    ),
                  };
                },
              },
            });
            cache.evict({ id });
          },
        },
      )
      .pipe(
        map((result) => result.data),
        filter((value): value is Exclude<typeof value, null | undefined> => {
          if (value != null) return true;
          this.notificationService.error(
            "No data returned from match deletion",
          );
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
  }
}
