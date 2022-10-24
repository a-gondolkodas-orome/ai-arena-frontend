import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class LoginStatusService {
  loginStatus$ = new Subject<{ type: "login"; token: string } | { type: "logout" }>();

  login(token: string) {
    this.loginStatus$.next({ type: "login", token });
  }

  logout() {
    this.loginStatus$.next({ type: "logout" });
  }
}
