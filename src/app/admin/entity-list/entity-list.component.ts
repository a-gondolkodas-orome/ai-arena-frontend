import { Component } from "@angular/core";

@Component({
  selector: "app-entity-list",
  templateUrl: "./entity-list.component.html",
  styleUrls: ["./entity-list.component.scss"],
})
export class EntityListComponent {
  entityTypes = [
    { name: "Users", uri: "users", enabled: false },
    { name: "Games", uri: "games", enabled: false },
    { name: "Bots", uri: "bots", enabled: false },
    { name: "Matches", uri: "matches", enabled: false },
    { name: "Contests", uri: "contests", enabled: true },
  ];
}
