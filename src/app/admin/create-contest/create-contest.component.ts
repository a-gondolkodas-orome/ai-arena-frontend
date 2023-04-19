import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { concatMap, filter, from, map, Observable, Subscription } from "rxjs";
import { handleGraphqlAuthErrors, handleValidationErrors } from "../../error";
import { Router } from "@angular/router";
import { NotificationService } from "../../services/notification.service";
import { CreateContestGQL, GameHeadFragment, GetGamesGQL } from "../../graphql/generated";
import { formNotNull } from "../../../utils";

@Component({
  selector: "app-create-contest",
  templateUrl: "./create-contest.component.html",
  styleUrls: ["./create-contest.component.scss"],
})
export class CreateContestComponent implements OnInit, OnDestroy {
  constructor(
    protected notificationService: NotificationService,
    protected getGames: GetGamesGQL,
    protected createContest: CreateContestGQL,
    protected router: Router,
    protected formBuilder: FormBuilder,
  ) {}

  createContestForm = this.formBuilder.group({
    game: this.formBuilder.control<GameHeadFragment | null>(null),
    mapNames: this.formBuilder.control<string[] | null>(null),
    name: "",
    date: null as Date | null,
  });
  gameList$!: Observable<GameHeadFragment[]>;
  selectedGame$!: Observable<GameHeadFragment | null>;

  ngOnInit() {
    this.gameList$ = this.getGames.watch().valueChanges.pipe(
      map((result) => result.data.getGames),
      handleGraphqlAuthErrors(this.notificationService),
      map((getGames) => getGames.games),
    );
    this.selectedGame$ = this.createContestForm.controls.game.valueChanges;
  }

  protected createContestSubscription?: Subscription;

  onSubmit() {
    const { game, ...formValues } = formNotNull(this.createContestForm.getRawValue());
    this.createContestSubscription = this.createContest
      .mutate({ contestInput: { ...formValues, gameId: game.id } })
      .pipe(
        map((result) => result.data),
        filter((value): value is Exclude<typeof value, null | undefined> => {
          if (value != null) return true;
          this.notificationService.error("No data returned from contest creation");
          return false;
        }),
        map((data) => data.createContest),
        handleGraphqlAuthErrors(this.notificationService),
        handleValidationErrors(
          "CreateContestError" as const,
          this.notificationService,
          this.createContestForm,
        ),
        concatMap((contest) => {
          return from(this.router.navigate(["admin", "contests", contest.id]));
        }),
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.createContestSubscription?.unsubscribe();
  }
}
