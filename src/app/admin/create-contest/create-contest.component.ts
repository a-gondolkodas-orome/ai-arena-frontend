import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { concatMap, filter, from, map, Observable, Subscription } from "rxjs";
import { handleGraphqlAuthErrors, handleValidationErrors } from "../../error";
import { Router } from "@angular/router";
import { NotificationService } from "../../services/notification.service";
import { CreateContestGQL, GetGamesGQL } from "../../graphql/generated";

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
  ) {
    this.createContestForm = this.formBuilder.nonNullable.group({ gameId: "", name: "", date: "" });
  }

  createContestForm!: FormGroup;
  gameList$!: Observable<{ value: string; text: string }[]>;

  ngOnInit() {
    this.gameList$ = this.getGames.watch().valueChanges.pipe(
      map((result) => result.data.getGames),
      handleGraphqlAuthErrors(this.notificationService),
      map((getGames) => getGames.games.map((game) => ({ value: game.id, text: game.name }))),
    );
  }

  protected createContestSubscription?: Subscription;

  onSubmit() {
    this.createContestSubscription = this.createContest
      .mutate({ contestInput: this.createContestForm.getRawValue() })
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
