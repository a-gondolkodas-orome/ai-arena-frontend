import { Component } from "@angular/core";
import { map, Observable } from "rxjs";
import { Router } from "@angular/router";
import { Game, GetGamesGQL } from "../graphql/generated";
import { handleGraphqlAuthErrors } from "../error";
import { NotificationService } from "../services/notification.service";

type GamePreview = Pick<Game, "id" | "name" | "picture" | "shortDescription">;

@Component({
  selector: "app-game-selector",
  templateUrl: "./game-selector.component.html",
  styleUrls: ["./game-selector.component.scss"],
})
export class GameSelectorComponent {
  constructor(
    protected getGames: GetGamesGQL,
    protected notificationService: NotificationService,
    protected router: Router,
  ) {
    this.games = this.getGames.watch().valueChanges.pipe(
      map((result) => result.data.getGames),
      handleGraphqlAuthErrors(this.notificationService),
      map((getGames) => getGames.games),
    );
  }

  games: Observable<GamePreview[]>;

  async handleSelection(selectedGame: GamePreview) {
    await this.router.navigate(["game", selectedGame.id], {
      state: selectedGame,
    });
  }
}
