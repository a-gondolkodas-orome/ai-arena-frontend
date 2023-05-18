import { Component, OnDestroy, OnInit } from "@angular/core";
import { NotificationService } from "../services/notification.service";
import {
  BotSubmitStage,
  ContestStatus,
  GetBotsGQL,
  GetContestGQL,
  RegisterToContestGQL,
  StartContestGQL,
  UnregisterFromContestGQL,
  UpdateContestStatusGQL,
  User,
} from "../graphql/generated";
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { combineLatest, filter, map, Observable, Subscription, switchMap, tap } from "rxjs";
import { handleGraphqlAuthErrors } from "../error";
import { AsyncPipe, CommonModule, DatePipe } from "@angular/common";
import { MatSelectModule } from "@angular/material/select";
import { MatButtonModule } from "@angular/material/button";
import { decode, decodeJson, Time } from "../../utils";
import * as t from "io-ts";
import { AuthService } from "../services/auth.service";
import { MatchListComponent } from "../match-list/match-list.component";
import { GetBotsQueryResult, GetContestQueryResult } from "../../types";
import { MatTooltipModule } from "@angular/material/tooltip";
import { scoresCodec } from "../../common";
import { MatTableModule } from "@angular/material/table";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(duration);
dayjs.extend(relativeTime);

type ContestData =
  | {
      adminMode: true;
      contest: GetContestQueryResult & {
        scoreBoard?: { place: number; username: string | null; botId: string; score: number }[];
      };
      bots?: undefined;
    }
  | {
      adminMode: false;
      contest: GetContestQueryResult & {
        scoreBoard?: { place: number; username: string | null; botId: string; score: number }[];
      };
      bots: GetBotsQueryResult;
      isRegistered: boolean;
    };

@Component({
  standalone: true,
  selector: "app-contest",
  templateUrl: "./contest.component.html",
  styleUrls: ["./contest.component.scss"],
  imports: [
    CommonModule,
    AsyncPipe,
    DatePipe,
    ReactiveFormsModule,
    MatSelectModule,
    MatButtonModule,
    MatchListComponent,
    MatTooltipModule,
    MatTableModule,
    MatProgressBarModule,
  ],
})
export class ContestComponent implements OnInit, OnDestroy {
  static readonly routeDataCodec = t.type({ adminMode: t.boolean });
  ContestStatus = ContestStatus;
  scoreBoardColumns = ["place", "username", "score"];

  constructor(
    protected notificationService: NotificationService,
    protected authService: AuthService,
    protected getContest: GetContestGQL,
    protected getBots: GetBotsGQL,
    protected register: RegisterToContestGQL,
    protected unregister: UnregisterFromContestGQL,
    protected updateStatus: UpdateContestStatusGQL,
    protected startContest: StartContestGQL,
    protected route: ActivatedRoute,
    protected router: Router,
    protected formBuilder: FormBuilder,
  ) {}

  contestData$!: Observable<ContestData>;
  adminMode = false;
  registerForm = this.formBuilder.nonNullable.group({ botId: "" });
  contestId!: string;

  ngOnInit() {
    this.adminMode =
      decode(ContestComponent.routeDataCodec, this.route.snapshot.data, null)?.adminMode ?? false;
    const contestId = this.route.snapshot.paramMap.get("id");
    if (contestId === null) this.notificationService.error("No contest id in path");
    else {
      this.contestId = contestId;
      const contestQuery = this.getContest.watch({ id: contestId });
      const contest$ = contestQuery.valueChanges.pipe(
        map((result) => result.data.getContest),
        filter(<T>(value: T): value is Exclude<T, null | undefined> => {
          if (value != null) return true;
          this.notificationService.error("Contest not found");
          return false;
        }),
        handleGraphqlAuthErrors(this.notificationService),
        tap((contest) => {
          if ([ContestStatus.Open, ContestStatus.Closed].includes(contest.status))
            contestQuery.startPolling(10 * Time.second);
          else if (contest.status === ContestStatus.Running)
            contestQuery.startPolling(3 * Time.second);
          else contestQuery.stopPolling();
        }),
      );
      const user$ = this.authService.userProfile$.pipe(filter((user): user is User => !!user));
      this.contestData$ = combineLatest([contest$, user$]).pipe(
        this.adminMode
          ? map<[GetContestQueryResult, User], ContestData>(([contest]) => ({
              adminMode: true as const,
              contest: { ...contest, scoreBoard: this.getScoreboard(contest) },
            }))
          : switchMap(([contest, user]) =>
              this.getBots
                .watch({ gameId: contest.game.id, includeTestBots: false })
                .valueChanges.pipe(
                  map((result) => result.data.getBots),
                  handleGraphqlAuthErrors(this.notificationService),
                  map((result) => ({
                    adminMode: false as const,
                    contest: { ...contest, scoreBoard: this.getScoreboard(contest) },
                    bots: result.bots.filter(
                      (bot) => bot.submitStatus.stage === BotSubmitStage.CheckSuccess,
                    ),
                    isRegistered: contest.bots.some(
                      (bot) => bot.__typename === "Bot" && bot.user.id === user.id,
                    ),
                  })),
                ),
            ),
      );
    }
  }

  protected getScoreboard(contest: GetContestQueryResult) {
    if (!contest.scoreJson) return undefined;
    const scores = decodeJson(scoresCodec, contest.scoreJson);
    const scoreboard = [];
    for (const bot of contest.bots) {
      scoreboard.push({
        username: bot.__typename === "Bot" ? bot.user.username : null,
        botId: bot.id,
        score: scores[bot.id],
        place: 0,
      });
    }
    scoreboard.sort((a, b) => b.score - a.score);
    scoreboard[0].place = 1;
    for (let i = 1; i < scoreboard.length; ++i)
      scoreboard[i].place =
        scoreboard[i].score === scoreboard[i - 1].score ? scoreboard[i - 1].place : i + 1;
    return scoreboard;
  }

  protected registrationSubscription?: Subscription;

  onRegisterToContest() {
    this.registrationSubscription = this.register
      .mutate({
        registration: { contestId: this.contestId, ...this.registerForm.getRawValue() },
      })
      .subscribe();
  }

  protected unregistrationSubscription?: Subscription;

  onUnregister() {
    this.unregistrationSubscription = this.unregister
      .mutate({ contestId: this.contestId })
      .subscribe();
  }

  protected updateStatusSubscription?: Subscription;

  onUpdateStatus(status: ContestStatus) {
    this.updateStatusSubscription = this.updateStatus
      .mutate({ contestId: this.contestId, status })
      .subscribe();
  }

  protected startContestSubscription?: Subscription;

  onStartContest() {
    this.startContestSubscription = this.startContest
      .mutate({ contestId: this.contestId })
      .subscribe();
  }

  ngOnDestroy() {
    this.registrationSubscription?.unsubscribe();
    this.unregistrationSubscription?.unsubscribe();
    this.updateStatusSubscription?.unsubscribe();
    this.startContestSubscription?.unsubscribe();
  }

  protected readonly dayjs = dayjs;
}
