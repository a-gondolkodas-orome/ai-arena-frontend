import { Injectable } from "@angular/core";
import { CanActivate, CanMatch, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { firstValueFrom } from "rxjs";
import { Role } from "../graphql/generated";

@Injectable({ providedIn: "root" })
export class AdminGuard implements CanActivate, CanMatch {
  constructor(protected router: Router, protected authService: AuthService) {}

  async canActivate() {
    return (await this.isAdmin()) ? true : this.router.createUrlTree([""]);
  }

  async canMatch() {
    return (await this.isAdmin()) ? true : this.router.createUrlTree([""]);
  }

  protected async isAdmin() {
    const userProfile = await firstValueFrom(this.authService.userProfile$);
    return userProfile?.roles?.includes(Role.Admin);
  }
}
