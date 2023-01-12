import { Component, OnDestroy, OnInit } from "@angular/core";
import { Bot, Exact, GetBotGQL, GetBotQuery } from "../graphql/generated";
import { ActivatedRoute, Router } from "@angular/router";
import { NotificationService } from "../services/notification.service";
import { Location } from "@angular/common";
import { concatMap, EMPTY, filter, map, Observable, Subscription } from "rxjs";
import { handleGraphqlAuthErrors } from "../error";
import { BOT_SUBMIT_STAGE__ERROR, BOT_SUBMIT_STAGE__IN_PROGRESS } from "../../bot";
import { Sse } from "../services/sse";
import { QueryRef } from "apollo-angular";
import { notNull } from "../../utils";

type BotInfo = Pick<Bot, "name" | "submitStatus">;

@Component({
  selector: "app-bot",
  templateUrl: "./bot.component.html",
  styleUrls: ["./bot.component.scss"],
})
export class BotComponent implements OnInit, OnDestroy {
  BOT_SUBMIT_STAGE__IN_PROGRESS = BOT_SUBMIT_STAGE__IN_PROGRESS;
  BOT_SUBMIT_STAGE__ERROR = BOT_SUBMIT_STAGE__ERROR;

  constructor(
    protected getBot: GetBotGQL,
    protected route: ActivatedRoute,
    protected router: Router,
    protected notificationService: NotificationService,
    protected location: Location,
  ) {}

  bot$?: Observable<BotInfo>;
  protected botQuery?: QueryRef<GetBotQuery, Exact<{ id: string }>>;
  protected sseSubscription?: Subscription;
  protected botId: string | null = null;

  ngOnInit() {
    this.botId = this.route.snapshot.paramMap.get("id");
    if (this.botId === null) {
      this.notificationService.error("No bot id in path");
      this.bot$ = EMPTY;
      this.handleBackToGame();
    } else {
      this.botQuery = this.getBot.watch({ id: this.botId });
      this.bot$ = this.botQuery.valueChanges.pipe(
        map((result) => result.data.getBot),
        filter(<T>(value: T): value is Exclude<T, null | undefined> => {
          if (value != null) return true;
          this.notificationService.error("Bot not found");
          return false;
        }),
        handleGraphqlAuthErrors(this.notificationService),
      );
      this.sseSubscription = Sse.botEvents
        .pipe(
          concatMap((event) => {
            return event.botUpdate === this.botId ? notNull(this.botQuery).refetch() : EMPTY;
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
