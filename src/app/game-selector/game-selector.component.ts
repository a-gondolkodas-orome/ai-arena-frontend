import { Component, OnInit } from "@angular/core";
import { Apollo, graphql } from "apollo-angular";
import { map, Observable, Subscription } from "rxjs";
import { Game } from "../../models/game";
import { Router } from "@angular/router";

type GamePreview = Pick<Game, "id" | "name" | "picture" | "shortDescription">;

type GamesQueryResponse = {
  games: GamePreview[];
};

@Component({
  selector: "app-game-selector",
  templateUrl: "./game-selector.component.html",
  styleUrls: ["./game-selector.component.scss"],
})
export class GameSelectorComponent implements OnInit {
  static readonly GAMES_QUERY = graphql`
    query GetGames {
      games {
        id
        name
        picture
        shortDescription
      }
    }
  `;

  constructor(protected apollo: Apollo, protected router: Router) {}

  protected getGamesSubscription?: Subscription;
  games?: Observable<GamePreview[]>;

  ngOnInit() {
    this.games = this.apollo
      .query<GamesQueryResponse>({ query: GameSelectorComponent.GAMES_QUERY })
      .pipe(map((result) => result.data.games));
    this.getGamesSubscription = this.games.subscribe();
  }

  ngOnDestroy() {
    this.getGamesSubscription?.unsubscribe();
  }

  async handleSelection(selectedGame: GamePreview) {
    await this.router.navigate(["game", selectedGame.id], {
      state: selectedGame,
    });
  }
}
