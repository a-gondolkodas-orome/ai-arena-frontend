import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { AddBotDialogComponent } from "../add-bot-dialog/add-bot-dialog.component";
import { Bot, DeleteBotGQL, Game, GetBotGQL, GetBotsGQL } from "../graphql/generated";
import { concatMap, filter, map, Observable, Subscription } from "rxjs";
import { handleGraphqlAuthErrors } from "../error";
import { NotificationService } from "../services/notification.service";
import * as t from "io-ts";
import { decode, getEvalStatus } from "../../utils";
import { Sse } from "../services/sse";

@Component({
  selector: "app-bot-list",
  templateUrl: "./bot-list.component.html",
  styleUrls: ["./bot-list.component.scss"],
})
export class BotListComponent implements OnInit, OnDestroy {
  static getBotsCacheCodec = t.type({
    __typename: t.literal("Bots"),
    bots: t.array(t.type({ __ref: t.string })),
  });

  @Input() game!: Game;

  constructor(
    protected dialog: MatDialog,
    protected getBots: GetBotsGQL,
    protected getBot: GetBotGQL,
    protected notificationService: NotificationService,
    protected deleteBotMutation: DeleteBotGQL,
  ) {}

  bots$?: Observable<(Pick<Bot, "id" | "name"> & { evalStatus: string })[]>;
  protected sseSubscription?: Subscription;

  ngOnInit() {
    this.bots$ = this.getBots.watch({ gameId: this.game.id }).valueChanges.pipe(
      map((result) => result.data.getBots),
      handleGraphqlAuthErrors(this.notificationService),
      map((getBots) =>
        getBots.bots.map((bot) => ({
          ...bot,
          evalStatus: getEvalStatus(bot.submitStatus.stage.toString()),
        })),
      ),
    );
    this.sseSubscription = Sse.botEvents
      .pipe(
        concatMap((event) =>
          this.getBot.fetch({ id: event.botUpdate }, { fetchPolicy: "network-only" }),
        ),
      )
      .subscribe();
  }

  addBot() {
    this.dialog.open(AddBotDialogComponent, {
      data: AddBotDialogComponent.addBotDialogDataCodec.encode({
        gameId: this.game.id,
      }),
    });
  }

  protected deleteBotSubscription?: Subscription;

  deleteBot(id: string, event: MouseEvent) {
    event.stopPropagation();
    this.deleteBotSubscription = this.deleteBotMutation
      .mutate(
        { id },
        {
          update: (cache, { data }) => {
            const cacheId = cache.identify({ __typename: "Bot", id });
            cache.modify({
              fields: {
                getBots: (cacheValue: unknown, { DELETE }) => {
                  const getBots = decode(BotListComponent.getBotsCacheCodec, cacheValue);
                  if (data == null || data.deleteBot !== null || !cacheId)
                    // TODO using DELETE is a workaround until INVALIDATE is fixed
                    // See https://github.com/apollographql/apollo-client/issues/7060
                    return DELETE;

                  return {
                    ...getBots,
                    bots: getBots.bots.filter((bot) => bot.__ref !== cacheId),
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
          this.notificationService.error("No data returned from bot deletion");
          return false;
        }),
        map((data) => data.deleteBot),
        filter((value): value is Exclude<typeof value, null> => {
          return value !== null;
        }),
        handleGraphqlAuthErrors(this.notificationService),
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.deleteBotSubscription?.unsubscribe();
    this.sseSubscription?.unsubscribe();
  }
}
