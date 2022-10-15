import { Component, Input, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { AddBotDialogComponent } from "../add-bot-dialog/add-bot-dialog.component";
import { Bot, Game, GetBotsGQL } from "../graphql/generated";
import { map, Observable } from "rxjs";
import { handleGraphqlAuthErrors } from "../error";
import { NotificationService } from "../services/notification.service";

@Component({
  selector: "app-bot-list",
  templateUrl: "./bot-list.component.html",
  styleUrls: ["./bot-list.component.scss"],
})
export class BotListComponent implements OnInit {
  @Input() game!: Game;

  constructor(
    protected dialog: MatDialog,
    protected getBots: GetBotsGQL,
    protected notificationService: NotificationService,
  ) {}

  bots$?: Observable<Pick<Bot, "name">[]>;

  ngOnInit() {
    this.bots$ = this.getBots.watch({ gameId: this.game.id }).valueChanges.pipe(
      map((result) => result.data.getBots),
      handleGraphqlAuthErrors(this.notificationService),
      map((getBots) => getBots.bots),
    );
  }

  addBot() {
    this.dialog.open(AddBotDialogComponent, {
      data: AddBotDialogComponent.addBotDialogDataCodec.encode({
        gameId: this.game.id,
      }),
    });
  }
}
