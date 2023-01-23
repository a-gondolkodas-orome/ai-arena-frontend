import { Component } from "@angular/core";

@Component({
  selector: "app-admin",
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.scss"],
})
export class AdminComponent {
  entityTypes = [
    { name: "Users", link: "users", enabled: false },
    { name: "Games", link: "games", enabled: false },
    { name: "Bots", link: "bots", enabled: false },
    { name: "Matches", link: "matches", enabled: false },
    { name: "Contests", link: "contests", enabled: true },
  ];
}
