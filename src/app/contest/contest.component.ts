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
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { combineLatest, filter, map, Observable, Subscription, switchMap } from "rxjs";
import { handleGraphqlAuthErrors } from "../error";
import { AsyncPipe, CommonModule, DatePipe } from "@angular/common";
import { MatSelectModule } from "@angular/material/select";
import { MatButtonModule } from "@angular/material/button";
import { decode } from "../../utils";
import * as t from "io-ts";
import { AuthService } from "../services/auth.service";
import { MatchListComponent } from "../match-list/match-list.component";
import { GetBotsQueryResult, GetContestQueryResult } from "../../types";

type ContestData =
  | { adminMode: true; contest: GetContestQueryResult; bots?: undefined }
  | {
      adminMode: false;
      contest: GetContestQueryResult;
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
  ],
})
export class ContestComponent implements OnInit, OnDestroy {
  static readonly routeDataCodec = t.type({ adminMode: t.boolean });
  ContestStatus = ContestStatus;

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
  ) {
    this.registerForm = this.formBuilder.nonNullable.group({ botId: "" });
  }

  contestData$!: Observable<ContestData>;
  adminMode = false;
  registerForm!: FormGroup;
  contestId!: string;

  ngOnInit() {
    this.adminMode =
      decode(ContestComponent.routeDataCodec, this.route.snapshot.data, null)?.adminMode ?? false;
    const contestId = this.route.snapshot.paramMap.get("id");
    if (contestId === null) this.notificationService.error("No contest id in path");
    else {
      this.contestId = contestId;
      const contest$ = this.getContest.watch({ id: contestId }).valueChanges.pipe(
        map((result) => result.data.getContest),
        filter(<T>(value: T): value is Exclude<T, null | undefined> => {
          if (value != null) return true;
          this.notificationService.error("Contest not found");
          return false;
        }),
        handleGraphqlAuthErrors(this.notificationService),
      );
      const user$ = this.authService.userProfile$.pipe(filter((user): user is User => !!user));
      this.contestData$ = combineLatest([contest$, user$]).pipe(
        this.adminMode
          ? map<[GetContestQueryResult, User], ContestData>(([contest]) => ({
              adminMode: true as const,
              contest,
            }))
          : switchMap(([contest, user]) =>
              this.getBots.watch({ gameId: contest.game.id }).valueChanges.pipe(
                map((result) => result.data.getBots),
                handleGraphqlAuthErrors(this.notificationService),
                map((result) => ({
                  adminMode: false as const,
                  contest,
                  bots: result.bots.filter(
                    (bot) => bot.submitStatus.stage === BotSubmitStage.CheckSuccess,
                  ),
                  isRegistered: contest.bots.some((bot) => bot.user.id === user.id),
                })),
              ),
            ),
      );
    }
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
}
