import { Component } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { LoginStatusService } from "../services/login-status.service";
import { User } from "../graphql/generated";

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
    this.userProfile = authService.userProfile$.asObservable();
  }

  userProfile: Observable<User | undefined>;

  onLogout() {
    this.loginStatusService.logout();
  }
}
