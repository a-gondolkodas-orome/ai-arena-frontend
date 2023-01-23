import { Component } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";
import { map, Observable } from "rxjs";
import { LoginStatusService } from "../services/login-status.service";
import { Role, User } from "../graphql/generated";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"],
})
export class SidebarComponent {
  constructor(
    protected authService: AuthService,
    protected loginStatusService: LoginStatusService,
    protected router: Router,
  ) {
    this.user$ = authService.userProfile$.asObservable().pipe(
      map(
        (user) =>
          user && {
            ...user,
            isAdmin: user.roles.includes(Role.Admin),
          },
      ),
    );
  }

  user$: Observable<(User & { isAdmin: boolean }) | undefined>;

  onLogout() {
    this.loginStatusService.logout();
  }
}
