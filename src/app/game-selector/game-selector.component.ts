import { Component, OnInit } from "@angular/core";
import { Apollo, graphql } from "apollo-angular";
import { map, Observable, Subscription } from "rxjs";
import { Game } from "../../models/game";

type GamesQueryResponse = { games: Game[] };

@Component({
  selector: "app-game-selector",
  templateUrl: "./game-selector.component.html",
  styleUrls: ["./game-selector.component.scss"],
})
export class GameSelectorComponent implements OnInit {
  static readonly GAMES_QUERY = graphql`
    query GetGames {
      games {
        name
        picture
        shortDescription
      }
    }
  `;

  constructor(protected apollo: Apollo) {}

  protected getGamesSubscription?: Subscription;
  games?: Observable<Game[]>;
  selectedGame: Game | undefined;

  ngOnInit() {
    this.games = this.apollo
      .query<GamesQueryResponse>({ query: GameSelectorComponent.GAMES_QUERY })
      .pipe(map((result) => result.data.games));
    this.getGamesSubscription = this.games.subscribe();
  }

  ngOnDestroy() {
    this.getGamesSubscription?.unsubscribe();
  }

  handleSelection(game: Game) {
    this.selectedGame = game;
  }
}
