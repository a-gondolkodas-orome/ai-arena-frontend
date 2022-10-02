import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppComponent } from "./app.component";
import { RegistrationComponent } from "./registration/registration.component";
import { LoginComponent } from "./login/login.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { GameComponent } from "./game/game.component";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatToolbarModule } from "@angular/material/toolbar";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { GameSelectorComponent } from "./game-selector/game-selector.component";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { ApolloModule } from "apollo-angular";
import { GraphqlAuthMiddlewareProvider } from "./services/graphql-auth-middleware.provider";
import { AuthGuard } from "./auth-guard";

@NgModule({
  declarations: [
    AppComponent,
    RegistrationComponent,
    LoginComponent,
    DashboardComponent,
    GameComponent,
    GameSelectorComponent,
    SidebarComponent,
  ],
  imports: [
    ApolloModule,
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
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
      { path: "**", redirectTo: "", canActivate: [AuthGuard] },
    ]),
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatToolbarModule,
    NgbModule,
  ],
  providers: [GraphqlAuthMiddlewareProvider],
  bootstrap: [AppComponent],
})
export class AppModule {}
