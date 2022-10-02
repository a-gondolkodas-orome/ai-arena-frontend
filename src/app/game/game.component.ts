import { Component } from "@angular/core";
import { filter, from, ignoreElements, map, Observable } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { FindGameGQL, Game } from "../graphql/generated";
import { handleGraphqlAuthErrors } from "../error";
import { NotificationService } from "../services/notification.service";

@Component({
  selector: "app-game",
  templateUrl: "./game.component.html",
  styleUrls: ["./game.component.scss"],
})
export class GameComponent {
  constructor(
    protected findGame: FindGameGQL,
    protected route: ActivatedRoute,
    protected router: Router,
    protected notificationService: NotificationService,
  ) {
    const gameId = this.route.snapshot.paramMap.get("id");
    if (gameId === null) {
      this.notificationService.error("No game id in path");
      this.selectedGame = from(this.handleBackToDashboard()).pipe(
        ignoreElements(),
      );
    } else {
      this.selectedGame = this.findGame.fetch({ id: gameId }).pipe(
        map((result) => result.data.findGame),
        filter(<T>(value: T): value is Exclude<T, null | undefined> => {
          if (value != null) return true;
          this.notificationService.error("Game not found");
          return false;
        }),
        handleGraphqlAuthErrors(this.notificationService),
      );
    }
  }

  selectedGame: Observable<Game>;

  async handleBackToDashboard() {
    await this.router.navigate([""]);
  }
}
