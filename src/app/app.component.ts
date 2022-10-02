import { Component } from "@angular/core";
import { AuthService } from "./services/auth.service";
import { Observable } from "rxjs";
import { User } from "./graphql/generated";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  constructor(protected authService: AuthService) {
    this.userProfile = authService.userProfile$.asObservable();
  }

  userProfile: Observable<User | undefined>;
}
