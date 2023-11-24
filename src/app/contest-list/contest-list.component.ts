import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  FlipContestArchivedStatusGQL,
  DeleteContestGQL,
  GetContestsGQL,
  GetContestsQuery,
} from "../graphql/generated";
import { NotificationService } from "../services/notification.service";
import { filter, map, Observable, Subscription } from "rxjs";
import { handleGraphqlAuthErrors } from "../error";
import { CommonModule } from "@angular/common";
import { MatListModule } from "@angular/material/list";
import { MatCardModule } from "@angular/material/card";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { decode, Time } from "../../utils";
import { MatChipsModule } from "@angular/material/chips";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import * as t from "io-ts";
import { MatTooltipModule } from "@angular/material/tooltip";

@Component({
  standalone: true,
  selector: "app-contest-list",
  templateUrl: "./contest-list.component.html",
  styleUrls: ["./contest-list.component.scss"],
  imports: [
    CommonModule,
    MatListModule,
    MatCardModule,
    RouterLink,
    MatChipsModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
  ],
})
export class ContestListComponent implements OnInit, OnDestroy {
  static readonly routeDataCodec = t.type({ adminMode: t.boolean });

  static getContestsCacheCodec = t.type({
    __typename: t.literal("Contests"),
    contests: t.array(t.type({ __ref: t.string })),
  });

  constructor(
    protected getContests: GetContestsGQL,
    protected deleteContestMutation: DeleteContestGQL,
    protected flipContestArchivedStatusMutation: FlipContestArchivedStatusGQL,
    protected notificationService: NotificationService,
    protected route: ActivatedRoute,
  ) {}

  adminMode = false;

  contests$?: Observable<
    Extract<GetContestsQuery["getContests"], { __typename: "Contests" }>["contests"]
  >;

  ngOnInit() {
    const routeData = decode(ContestListComponent.routeDataCodec, this.route.snapshot.data, null);
    if (routeData?.adminMode) {
      this.adminMode = true;
    }
    this.contests$ = this.getContests
      .watch({ includeMatchSizeTotal: this.adminMode }, { pollInterval: 10 * Time.second })
      .valueChanges.pipe(
        map((result) => result.data.getContests),
        handleGraphqlAuthErrors(this.notificationService),
        map((getContests) => getContests.contests),
      );
  }

  protected flipContestArchivedStatusSubscription?: Subscription;

  archiveContest(id: string, event: MouseEvent) {
    event.stopPropagation();
    this.flipContestArchivedStatusSubscription = this.flipContestArchivedStatusMutation
      .mutate({ id })
      .pipe(
        map((result) => result.data),
        filter((value): value is Exclude<typeof value, null | undefined> => {
          if (value != null) return true;
          this.notificationService.error("No data returned from contest deletion");
          return false;
        }),
        map((data) => data.flipContestArchivedStatus),
        filter((value): value is Exclude<typeof value, null> => {
          return value !== null;
        }),
        handleGraphqlAuthErrors(this.notificationService),
      )
      .subscribe();
  }

  protected deleteContestSubscription?: Subscription;

  deleteContest(id: string, event: MouseEvent) {
    event.stopPropagation();
    this.deleteContestSubscription = this.deleteContestMutation
      .mutate(
        { id },
        {
          update: (cache, { data }) => {
            const cacheId = cache.identify({ __typename: "Contest", id });
            cache.modify({
              fields: {
                getContests: (cacheValue: unknown, { DELETE }: { DELETE: unknown }) => {
                  const getContests = decode(
                    ContestListComponent.getContestsCacheCodec,
                    cacheValue,
                  );
                  if (data == null || data.deleteContest !== null || !cacheId) return DELETE;

                  return {
                    ...getContests,
                    contests: getContests.contests.filter((contest) => contest.__ref !== cacheId),
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
          this.notificationService.error("No data returned from contest deletion");
          return false;
        }),
        map((data) => data.deleteContest),
        filter((value): value is Exclude<typeof value, null> => {
          return value !== null;
        }),
        handleGraphqlAuthErrors(this.notificationService),
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.flipContestArchivedStatusSubscription?.unsubscribe();
    this.deleteContestSubscription?.unsubscribe();
  }

  protected readonly Math = Math;
}
