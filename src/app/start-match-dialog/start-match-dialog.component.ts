import { Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from "@angular/core";
import * as t from "io-ts";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { AbstractControl, FormBuilder } from "@angular/forms";
import {
  Bot,
  BotSubmitStage,
  CreateMatchGQL,
  GameMap,
  GetBotsGQL,
  GetGameGQL,
  Match,
  PlayerCount,
} from "../graphql/generated";
import { NotificationService } from "../services/notification.service";
import { decode, notNull } from "../../utils";
import { combineLatest, filter, map, Observable, startWith, Subscription, tap } from "rxjs";
import { handleGraphqlAuthErrors, handleValidationErrors } from "../error";
import { MatchListComponent } from "../match-list/match-list.component";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { GetGameQueryResult } from "../../types";
import { ErrorStateMatcher } from "@angular/material/core";
import { ToReferenceFunction } from "@apollo/client/cache/core/types/common";
type BotHead = Pick<Bot, "id" | "name">;
const botHeadCodec = t.type({ id: t.string, name: t.string });

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
    protected getGame: GetGameGQL,
    protected getBots: GetBotsGQL,
    protected startMatch: CreateMatchGQL,
    protected notificationService: NotificationService,
    @Inject(MAT_DIALOG_DATA) unknownData: unknown,
  ) {
    this.data = decode(StartMatchDialogComponent.startMatchDialogDataCodec, unknownData);
  }

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  protected data: t.TypeOf<typeof StartMatchDialogComponent.startMatchDialogDataCodec>;
  game$!: Observable<GetGameQueryResult>;
  allBots$!: Observable<BotHead[]>;
  startMatchData$!: Observable<{ game: GetGameQueryResult; bots: BotHead[] }>;
  selectedBots: BotHead[] = [];
  protected mapControl = this.formBuilder.control<GameMap | undefined>(undefined);
  startMatchForm = this.formBuilder.group({
    map: this.mapControl,
    selectBot: this.formBuilder.nonNullable.control<BotHead | string>("", () => {
      const playerCount: PlayerCount | undefined = this.mapControl.value?.playerCount;
      if (!playerCount) return { noMapSelected: true };
      if (this.selectedBots.length < playerCount.min) return { notEnoughPlayers: playerCount.min };
      if (this.selectedBots.length > playerCount.max) return { tooManyPlayers: playerCount.max };
      return null;
    }),
  });
  selectBotErrorStateMatcher: ErrorStateMatcher = {
    isErrorState: (control: AbstractControl | null) => {
      return this.selectBotTouched && !!control?.invalid;
    },
  };
  @ViewChild("botInput") botInput!: ElementRef<HTMLInputElement>;

  ngOnInit() {
    this.game$ = this.getGame.watch({ id: this.data.gameId }).valueChanges.pipe(
      map((result) => result.data.getGame),
      filter(<T>(value: T): value is Exclude<T, null | undefined> => {
        if (value != null) return true;
        this.notificationService.error("Game not found");
        return false;
      }),
      handleGraphqlAuthErrors(this.notificationService),
      tap((game) => this.startMatchForm.controls.map.setValue(game.maps[0])),
    );
    this.allBots$ = this.getBots
      .watch({ gameId: this.data.gameId, includeTestBots: true })
      .valueChanges.pipe(
        map((result) => result.data.getBots),
        handleGraphqlAuthErrors(this.notificationService),
        map((getBots) =>
          getBots.bots.filter((bot) => bot.submitStatus.stage === BotSubmitStage.CheckSuccess),
        ),
      );
    this.startMatchData$ = combineLatest([
      this.game$,
      this.allBots$,
      this.startMatchForm.controls.selectBot.valueChanges.pipe(startWith("")),
    ]).pipe(
      map(([game, allBots, filter]) => {
        const bots =
          typeof filter === "string" ? this.filterBots(allBots, filter) : allBots.slice();
        return { game, bots };
      }),
    );
  }

  removeBot(id: string): void {
    const index = this.selectedBots.findIndex((bot) => bot.id === id);
    if (index >= 0) {
      this.selectedBots.splice(index, 1);
    }
    this.startMatchForm.controls.selectBot.updateValueAndValidity();
  }

  selectBotTouched = false;
  selected(event: MatAutocompleteSelectedEvent): void {
    this.selectedBots.push(decode(botHeadCodec, event.option.value));
    this.botInput.nativeElement.value = "";
    this.startMatchForm.controls.selectBot.setValue("");
    this.selectBotTouched = true;
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
            mapName: notNull(this.startMatchForm.controls.map.value?.name),
            botIds: this.selectedBots.map(({ id }) => id),
          },
        },
        {
          update: (cache, { data }) => {
            cache.modify({
              fields: {
                getMatches: (
                  cacheValue: unknown,
                  { toReference, DELETE }: { toReference: ToReferenceFunction; DELETE: unknown },
                ) => {
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
