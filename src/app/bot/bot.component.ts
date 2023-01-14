import { Component, OnDestroy, OnInit } from "@angular/core";
import { Bot, GetBotGQL } from "../graphql/generated";
import { ActivatedRoute, Router } from "@angular/router";
import { NotificationService } from "../services/notification.service";
import { Location } from "@angular/common";
import { concatMap, EMPTY, filter, map, Observable, Subscription } from "rxjs";
import { handleGraphqlAuthErrors } from "../error";
import { Sse } from "../services/sse";
import { getEvalStatus, notNull } from "../../utils";

type BotInfo = Pick<Bot, "name" | "submitStatus"> & { evalStatus: string };

@Component({
  selector: "app-bot",
  templateUrl: "./bot.component.html",
  styleUrls: ["./bot.component.scss"],
})
export class BotComponent implements OnInit, OnDestroy {
  constructor(
    protected getBot: GetBotGQL,
    protected route: ActivatedRoute,
    protected router: Router,
    protected notificationService: NotificationService,
    protected location: Location,
  ) {}

  bot$?: Observable<BotInfo>;
  protected sseSubscription?: Subscription;

  ngOnInit() {
    const botId = this.route.snapshot.paramMap.get("id");
    if (botId === null) {
      this.notificationService.error("No bot id in path");
      this.bot$ = EMPTY;
      this.handleBackToGame();
    } else {
      const botQuery = this.getBot.watch({ id: botId });
      this.bot$ = botQuery.valueChanges.pipe(
        map((result) => result.data.getBot),
        filter(<T>(value: T): value is Exclude<T, null | undefined> => {
          if (value != null) return true;
          this.notificationService.error("Bot not found");
          return false;
        }),
        handleGraphqlAuthErrors(this.notificationService),
        map((bot) => ({ ...bot, evalStatus: getEvalStatus(bot.submitStatus.stage) })),
      );
      this.sseSubscription = Sse.botEvents
        .pipe(
          concatMap((event) => {
            return event.botUpdate === botId ? notNull(botQuery).refetch() : EMPTY;
          }),
        )
        .subscribe();
    }
  }

  handleBackToGame() {
    this.location.back();
  }

  ngOnDestroy() {
    this.sseSubscription?.unsubscribe();
  }
}
