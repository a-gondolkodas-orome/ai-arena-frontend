import { Component, OnInit } from "@angular/core";
import { GetContestsGQL, GetContestsQuery } from "../graphql/generated";
import { NotificationService } from "../services/notification.service";
import { map, Observable } from "rxjs";
import { handleGraphqlAuthErrors } from "../error";
import { CommonModule } from "@angular/common";
import { MatListModule } from "@angular/material/list";
import { MatCardModule } from "@angular/material/card";
import { RouterLink } from "@angular/router";
import { Time } from "../../utils";

@Component({
  standalone: true,
  selector: "app-contest-list",
  templateUrl: "./contest-list.component.html",
  styleUrls: ["./contest-list.component.scss"],
  imports: [CommonModule, MatListModule, MatCardModule, RouterLink],
})
export class ContestListComponent implements OnInit {
  constructor(
    protected getContests: GetContestsGQL,
    protected notificationService: NotificationService,
  ) {}

  contests$?: Observable<
    Extract<GetContestsQuery["getContests"], { __typename: "Contests" }>["contests"]
  >;

  ngOnInit() {
    this.contests$ = this.getContests
      .watch(undefined, { pollInterval: 10 * Time.second })
      .valueChanges.pipe(
        map((result) => result.data.getContests),
        handleGraphqlAuthErrors(this.notificationService),
        map((getContests) => getContests.contests),
      );
  }
}
