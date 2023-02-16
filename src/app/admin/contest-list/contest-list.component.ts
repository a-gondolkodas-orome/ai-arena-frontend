import { Component, OnInit } from "@angular/core";
import { Contest, GetContestsGQL } from "../../graphql/generated";
import { NotificationService } from "../../services/notification.service";
import { map, Observable } from "rxjs";
import { handleGraphqlAuthErrors } from "../../error";

@Component({
  selector: "app-contest-list",
  templateUrl: "./contest-list.component.html",
  styleUrls: ["./contest-list.component.scss"],
})
export class ContestListComponent implements OnInit {
  constructor(
    protected getContests: GetContestsGQL,
    protected notificationService: NotificationService,
  ) {}

  contests$?: Observable<Pick<Contest, "id" | "name">[]>;

  ngOnInit() {
    this.contests$ = this.getContests.watch().valueChanges.pipe(
      map((result) => result.data.getContests),
      handleGraphqlAuthErrors(this.notificationService),
      map((getContests) => getContests.contests),
    );
  }
}
