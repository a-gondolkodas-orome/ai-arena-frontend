import { Component } from "@angular/core";
import { filter, from, ignoreElements, map, Observable } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { GetGameGQL, Game } from "../graphql/generated";
import { handleGraphqlAuthErrors } from "../error";
import { NotificationService } from "../services/notification.service";
import { marked } from "marked";
import * as DOMPurify from "dompurify";

@Component({
  selector: "app-game",
  templateUrl: "./game.component.html",
  styleUrls: ["./game.component.scss"],
})
export class GameComponent {
  constructor(
    protected findGame: GetGameGQL,
    protected route: ActivatedRoute,
    protected router: Router,
    protected notificationService: NotificationService,
  ) {
    const gameId = this.route.snapshot.paramMap.get("id");
    if (gameId === null) {
      this.notificationService.error("No game id in path");
      this.game$ = from(this.handleBackToDashboard()).pipe(ignoreElements());
    } else {
      this.game$ = this.findGame.watch({ id: gameId }).valueChanges.pipe(
        map((result) => result.data.getGame),
        filter(<T>(value: T): value is Exclude<T, null | undefined> => {
          if (value != null) return true;
          this.notificationService.error("Game not found");
          return false;
        }),
        handleGraphqlAuthErrors(this.notificationService),
      );
    }
  }

  game$: Observable<Game>;

  async handleBackToDashboard() {
    await this.router.navigate([""]);
  }

  protected renderGameDescription(rawDescription: string) {
    return DOMPurify.sanitize(marked.parse(rawDescription)); // security threat?
  }
}
