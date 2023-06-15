import { Component } from "@angular/core";
import { filter, from, ignoreElements, map, Observable, tap } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { GetGameGQL } from "../graphql/generated";
import { handleGraphqlAuthErrors } from "../error";
import { NotificationService } from "../services/notification.service";
import { marked } from "marked";
import * as DOMPurify from "dompurify";
import { GetGameQueryResult } from "../../types";
import { DomSanitizer } from "@angular/platform-browser";
import { decodeJson, notNull } from "../../utils";
import * as t from "io-ts";

@Component({
  selector: "app-game",
  templateUrl: "./game.component.html",
  styleUrls: ["./game.component.scss"],
})
export class GameComponent {
  static readonly fullDescriptionCodec = t.record(t.string, t.string);

  constructor(
    protected getGame: GetGameGQL,
    protected route: ActivatedRoute,
    protected router: Router,
    protected notificationService: NotificationService,
    protected sanitizer: DomSanitizer,
  ) {
    const gameId = this.route.snapshot.paramMap.get("id");
    if (gameId === null) {
      this.notificationService.error("No game id in path");
      this.game$ = from(this.handleBackToDashboard()).pipe(ignoreElements());
    } else {
      this.game$ = this.getGame.watch({ id: gameId }).valueChanges.pipe(
        map((result) => result.data.getGame),
        filter(<T>(value: T): value is Exclude<T, null | undefined> => {
          if (value != null) return true;
          this.notificationService.error("Game not found");
          return false;
        }),
        handleGraphqlAuthErrors(this.notificationService),
        map((game) => ({
          ...game,
          fullDescriptionOptions: Object.entries(
            decodeJson(GameComponent.fullDescriptionCodec, game.fullDescription),
          ).map(([languageCode, description]) => ({ languageCode, description })),
        })),
        tap((game) => {
          const userLanguage = window.navigator.language;
          const descriptionLanguageCodes = game.fullDescriptionOptions.map(
            ({ languageCode }) => languageCode,
          );
          this.descriptionLanguage =
            descriptionLanguageCodes.find((languageCode) => languageCode === userLanguage) ||
            descriptionLanguageCodes.find(
              (languageCode) => languageCode === userLanguage.substring(0, 2),
            ) ||
            (descriptionLanguageCodes.includes("en") && "en") ||
            descriptionLanguageCodes[0];
        }),
      );
    }
  }

  game$: Observable<
    GetGameQueryResult & { fullDescriptionOptions: { languageCode: string; description: string }[] }
  >;

  descriptionLanguage!: string;

  async handleBackToDashboard() {
    await this.router.navigate([""]);
  }

  protected renderGameDescription(
    fullDescriptionOptions: {
      languageCode: string;
      description: string;
    }[],
    descriptionLanguage: string,
  ) {
    const rawDescription = notNull(
      fullDescriptionOptions.find((option) => option.languageCode === descriptionLanguage),
    ).description;
    return this.sanitizer.bypassSecurityTrustHtml(DOMPurify.sanitize(marked.parse(rawDescription)));
  }
}
