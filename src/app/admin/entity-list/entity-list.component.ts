import { Component } from "@angular/core";

@Component({
  selector: "app-entity-list",
  templateUrl: "./entity-list.component.html",
  styleUrls: ["./entity-list.component.scss"],
})
export class EntityListComponent {
  entityTypes = [
    { name: "Users", link: "users", enabled: false },
    { name: "Games", link: "games", enabled: false },
    { name: "Bots", link: "bots", enabled: false },
    { name: "Matches", link: "matches", enabled: false },
    { name: "Contests", link: "contests", enabled: true },
  ];
}
