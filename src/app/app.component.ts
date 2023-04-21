import { Component } from "@angular/core";
import { AuthService } from "./services/auth.service";
import { BehaviorSubject, Observable } from "rxjs";
import { User } from "./graphql/generated";
import { symbolHideUserInfo } from "../types";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  constructor(protected authService: AuthService) {
    this.userProfile$ = authService.userProfile$.asObservable();
  }

  hideUserInfo$ = new BehaviorSubject<boolean>(false);
  userProfile$: Observable<User | undefined>;

  onActivate(component: unknown) {
    this.hideUserInfo$.next(
      !!(component as { [symbolHideUserInfo]?: boolean })[symbolHideUserInfo],
    );
  }
}
