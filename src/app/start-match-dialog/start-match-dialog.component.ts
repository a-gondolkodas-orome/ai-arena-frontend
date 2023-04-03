import { Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from "@angular/core";
import * as t from "io-ts";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormBuilder } from "@angular/forms";
import { Bot, CreateMatchGQL, GetBotsGQL, Match } from "../graphql/generated";
import { NotificationService } from "../services/notification.service";
import { decode } from "../../utils";
import { combineLatest, filter, map, Observable, startWith, Subscription, tap } from "rxjs";
import { handleGraphqlAuthErrors, handleValidationErrors } from "../error";
import { MatchListComponent } from "../match-list/match-list.component";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";

type BotHead = Pick<Bot, "id" | "name">;

@Component({
  selector: "app-start-match-dialog",
  templateUrl: "./start-match-dialog.component.html",
  styleUrls: ["./start-match-dialog.component.scss"],
})
export class StartMatchDialogComponent implements OnInit, OnDestroy {
  static readonly startMatchDialogDataCodec = t.type({ gameId: t.string });

  constructor(
    protected dialogRef: MatDialogRef<StartMatchDialogComponent>,
    protected formBuilder: FormBuilder,
    protected getBots: GetBotsGQL,
    protected startMatch: CreateMatchGQL,
    protected notificationService: NotificationService,
    @Inject(MAT_DIALOG_DATA) unknownData: unknown,
  ) {
    this.data = decode(StartMatchDialogComponent.startMatchDialogDataCodec, unknownData);
  }

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  protected data: t.TypeOf<typeof StartMatchDialogComponent.startMatchDialogDataCodec>;
  allBots$?: Observable<BotHead[]>;
  filteredBots$?: Observable<BotHead[]>;
  selectedBots: BotHead[] = [];
  startMatchForm = this.formBuilder.group({
    selectBot: this.formBuilder.nonNullable.control<BotHead | string>("", () => {
      return this.selectedBots.length ? null : { required: true };
    }),
  });

  @ViewChild("botInput") botInput!: ElementRef<HTMLInputElement>;

  ngOnInit() {
    this.allBots$ = this.getBots.watch({ gameId: this.data.gameId }).valueChanges.pipe(
      map((result) => result.data.getBots),
      handleGraphqlAuthErrors(this.notificationService),
      map((getBots) => getBots.bots),
    );
    this.filteredBots$ = combineLatest([
      this.allBots$,
      this.startMatchForm.controls.selectBot.valueChanges.pipe(startWith("")),
    ]).pipe(
      map(([allBots, filter]) =>
        typeof filter === "string" ? this.filterBots(allBots, filter) : allBots.slice(),
      ),
    );
  }

  removeBot(id: string): void {
    const index = this.selectedBots.findIndex((bot) => bot.id === id);
    if (index >= 0) {
      this.selectedBots.splice(index, 1);
    }
    this.startMatchForm.controls.selectBot.updateValueAndValidity();
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.selectedBots.push(event.option.value);
    this.botInput.nativeElement.value = "";
    this.startMatchForm.controls.selectBot.setValue("");
  }

  protected filterBots(allBots: BotHead[], value: string) {
    const filterValue = value.toLowerCase();
    return allBots.filter((bot) => bot.name.toLowerCase().includes(filterValue));
  }

  startMatchSubscription?: Subscription;

  onSubmit() {
    const closeDialog = () => this.dialogRef.close();
    this.startMatchSubscription = this.startMatch
      .mutate(
        {
          matchInput: {
            gameId: this.data.gameId,
            botIds: this.selectedBots.map(({ id }) => id),
          },
        },
        {
          update: (cache, { data }) => {
            cache.modify({
              fields: {
                getMatches: (cacheValue: unknown, { toReference, DELETE }) => {
                  const getMatches = decode(MatchListComponent.getMatchesCacheCodec, cacheValue);
                  const match = data?.createMatch as Match;
                  let id;
                  if (match?.__typename !== "Match" || !(id = cache.identify(match))) return DELETE;
                  return {
                    ...getMatches,
                    matches: [...getMatches.matches, toReference(id)],
                  };
                },
              },
            });
          },
        },
      )
      .pipe(
        map((result) => result.data),
        filter((value): value is Exclude<typeof value, null | undefined> => {
          if (value != null) return true;
          this.notificationService.error("No data returned from match creation");
          return false;
        }),
        map((data) => data.createMatch),
        handleGraphqlAuthErrors(this.notificationService),
        handleValidationErrors(
          "StartMatchError" as const,
          this.notificationService,
          this.startMatchForm,
        ),
        tap({ next: closeDialog, error: closeDialog }),
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.startMatchSubscription?.unsubscribe();
  }
}
