import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class LoginStatusService {
  loginStatus$ = new Subject<
    { type: "login"; token: string; returnUrl?: string } | { type: "logout" }
  >();

  login(token: string, returnUrl?: string) {
    this.loginStatus$.next({ type: "login", token, returnUrl });
  }

  logout() {
    this.loginStatus$.next({ type: "logout" });
  }
}
