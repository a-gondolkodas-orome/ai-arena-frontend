import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { RegistrationComponent } from "./registration/registration.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { AuthGuard } from "./auth/auth.guard";
import { GameComponent } from "./game/game.component";
import { BotComponent } from "./bot/bot.component";
import { MatchComponent } from "./match/match.component";
import { AdminGuard } from "./auth/admin.guard";

const appRoutes: Routes = [
  { path: "login", component: LoginComponent, title: "AI Arena - Login" },
  {
    path: "register",
    component: RegistrationComponent,
    title: "AI Arena - Register",
  },
  {
    path: "",
    component: DashboardComponent,
    canActivate: [AuthGuard],
    title: "AI Arena",
  },
  {
    path: "game/:id",
    component: GameComponent,
    canActivate: [AuthGuard],
    title: "AI Arena",
  },
  {
    path: "bot/:id",
    component: BotComponent,
    canActivate: [AuthGuard],
    title: "AI Arena",
  },
  {
    path: "match/:id",
    component: MatchComponent,
    canActivate: [AuthGuard],
    title: "AI Arena",
  },
  {
    path: "admin",
    loadChildren: () => import("./admin/admin.module").then((m) => m.AdminModule),
    canMatch: [AdminGuard],
  },
  { path: "**", redirectTo: "", canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
