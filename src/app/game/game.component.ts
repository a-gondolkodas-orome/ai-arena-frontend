import { Component, OnInit } from "@angular/core";
import { Apollo, graphql } from "apollo-angular";
import { map, Observable, Subscription } from "rxjs";
import { Game } from "../../models/game";
import { ActivatedRoute, Router } from "@angular/router";
import { notNull } from "../../utils";

type FindGameResponse = {
  findGame: Game;
};

@Component({
  selector: "app-game",
  templateUrl: "./game.component.html",
  styleUrls: ["./game.component.scss"],
})
export class GameComponent implements OnInit {
  static readonly FIND_GAME_QUERY = graphql`
    query FindGame($id: String!) {
      findGame(id: $id) {
        id
        name
        shortDescription
        picture
        fullDescription
        playerCount {
          min
          max
        }
      }
    }
  `;

  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    protected apollo: Apollo,
  ) {}

  protected getSelectedGameSubscription?: Subscription;
  selectedGame?: Observable<Game>;

  ngOnInit() {
    const gameId = notNull(this.route.snapshot.paramMap.get("id"));
    this.selectedGame = this.apollo
      .query<FindGameResponse>({
        query: GameComponent.FIND_GAME_QUERY,
        variables: { id: gameId },
      })
      .pipe(map((result) => ({ ...result.data.findGame })));
    this.getSelectedGameSubscription = this.selectedGame.subscribe();
  }

  ngOnDestroy() {
    this.getSelectedGameSubscription?.unsubscribe();
  }

  async handleClearSelection() {
    await this.router.navigate([""]);
  }
}
