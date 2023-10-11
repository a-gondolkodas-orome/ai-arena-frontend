import { Injectable } from "@angular/core";
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { JwtToken } from "../services/jwt-token";
import { LoginComponent } from "../login/login.component";

@Injectable({ providedIn: "root" })
export class AuthGuard {
  constructor(protected router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return JwtToken.get()
      ? true
      : this.router.createUrlTree(["/login"], {
          queryParams: { [LoginComponent.QUERY_PARAM__RETURN_URL]: state.url },
        });
  }
}
